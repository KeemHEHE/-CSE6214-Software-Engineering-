// M4 Collection Scheduling and Assignment: UC-09 to UC-12.
// Also owns OPT-04 (route optimisation), per the subsystem ownership table.
import { Router } from 'express';
import { db } from '../../db';
import { requireAuth, requireRole } from '../../middleware/auth';

export const schedulingRouter = Router();

const DAY_CODES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

function notify(userId: number, type: string, message: string) {
  db.prepare('INSERT INTO NOTIFICATION (user_id, type, message) VALUES (?, ?, ?)').run(userId, type, message);
}

// FR-19: officer manages recurring collection schedules.
schedulingRouter.post('/schedules', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const { point_id, waste_type, time_slot, days } = req.body as {
    point_id: number;
    waste_type?: string;
    time_slot: string;
    days: string[];
  };

  const result = db
    .prepare('INSERT INTO COLLECTION_SCHEDULE (point_id, created_by, waste_type, time_slot) VALUES (?, ?, ?, ?)')
    .run(point_id, req.user!.id, waste_type ?? null, time_slot);

  const scheduleId = Number(result.lastInsertRowid);
  const insertDay = db.prepare('INSERT INTO SCHEDULE_DAY (schedule_id, day_of_week) VALUES (?, ?)');
  days.forEach((day) => insertDay.run(scheduleId, day));

  res.status(201).json({ scheduleId });
});

schedulingRouter.get('/schedules', requireAuth, (_req, res) => {
  const schedules = db
    .prepare(
      `SELECT s.*, GROUP_CONCAT(sd.day_of_week) AS days
       FROM COLLECTION_SCHEDULE s
       LEFT JOIN SCHEDULE_DAY sd ON sd.schedule_id = s.schedule_id
       WHERE s.is_active = 1
       GROUP BY s.schedule_id`
    )
    .all();
  res.json(schedules);
});

schedulingRouter.delete('/schedules/:id', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  db.prepare('UPDATE COLLECTION_SCHEDULE SET is_active = 0 WHERE schedule_id = ?').run(req.params.id);
  res.json({ deactivated: true });
});

// FR-20: generate today's collection tasks from active schedules.
// In production this runs as a node-cron job at 06:00; exposed here as an
// endpoint so it can be triggered on demand for demos and testing.
schedulingRouter.post('/tasks/generate', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const date = (req.body.date as string) ?? new Date().toISOString().slice(0, 10);
  const dayCode = DAY_CODES[new Date(date).getDay()];

  const dueSchedules = db
    .prepare(
      `SELECT s.schedule_id, s.point_id, s.waste_type
       FROM COLLECTION_SCHEDULE s
       JOIN SCHEDULE_DAY sd ON sd.schedule_id = s.schedule_id
       WHERE s.is_active = 1 AND sd.day_of_week = ?
         AND NOT EXISTS (
           SELECT 1 FROM COLLECTION_TASK t WHERE t.schedule_id = s.schedule_id AND t.scheduled_date = ?
         )`
    )
    .all(dayCode, date) as { schedule_id: number; point_id: number; waste_type: string | null }[];

  const insertTask = db.prepare(
    'INSERT INTO COLLECTION_TASK (point_id, schedule_id, waste_type, scheduled_date) VALUES (?, ?, ?, ?)'
  );
  const created = dueSchedules.map((s) => insertTask.run(s.point_id, s.schedule_id, s.waste_type, date).lastInsertRowid);

  res.json({ generated: created.length, date });
});

// FR-21: officer assigns unassigned tasks (including report-triggered ones) to a worker.
schedulingRouter.patch('/tasks/:id/assign', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const { worker_id } = req.body as { worker_id: number };
  const task = db.prepare('SELECT status, report_id FROM COLLECTION_TASK WHERE task_id = ?').get(req.params.id) as
    | { status: string; report_id: number | null }
    | undefined;
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (task.status === 'IN_PROGRESS' || task.status === 'COMPLETED') {
    return res.status(409).json({ error: 'Cannot reassign a task that has already started' });
  }

  db.prepare("UPDATE COLLECTION_TASK SET worker_id = ?, status = 'ASSIGNED' WHERE task_id = ?").run(
    worker_id,
    req.params.id
  );
  if (task.report_id) {
    db.prepare("UPDATE WASTE_REPORT SET status = 'ASSIGNED' WHERE report_id = ?").run(task.report_id);
  }
  notify(worker_id, 'task_assigned', `You have been assigned task #${req.params.id}`);
  res.json({ assigned: true });
});

// FR-22: worker views assigned tasks, soonest and highest priority first.
schedulingRouter.get('/tasks', requireAuth, (req, res) => {
  const { role, id } = req.user!;
  const priorityOrder = "CASE priority WHEN 'HIGH' THEN 0 WHEN 'MEDIUM' THEN 1 ELSE 2 END";
  const tasks =
    role === 'WORKER'
      ? db
          .prepare(`SELECT * FROM COLLECTION_TASK WHERE worker_id = ? ORDER BY scheduled_date, ${priorityOrder}`)
          .all(id)
      : db.prepare(`SELECT * FROM COLLECTION_TASK ORDER BY scheduled_date, ${priorityOrder}`).all();
  res.json(tasks);
});

schedulingRouter.patch('/tasks/:id/start', requireAuth, requireRole('WORKER'), (req, res) => {
  db.prepare("UPDATE COLLECTION_TASK SET status = 'IN_PROGRESS', started_at = datetime('now') WHERE task_id = ?").run(
    req.params.id
  );
  res.json({ started: true });
});

schedulingRouter.patch('/tasks/:id/miss', requireAuth, requireRole('WORKER'), (req, res) => {
  const { remarks } = req.body as { remarks: string };
  db.prepare("UPDATE COLLECTION_TASK SET status = 'MISSED', remarks = ? WHERE task_id = ?").run(
    remarks,
    req.params.id
  );
  res.json({ missed: true });
});

// FR-23, FR-24, FR-25: complete a task, recording weight per bin and updating
// fill status in a single transaction; auto-resolves a linked report.
schedulingRouter.post('/tasks/:id/complete', requireAuth, requireRole('WORKER'), (req, res) => {
  const { records } = req.body as { records: { bin_id: number; weight_kg: number; fill_status_after: string }[] };
  const taskId = Number(req.params.id);

  const task = db.prepare('SELECT report_id FROM COLLECTION_TASK WHERE task_id = ?').get(taskId) as
    | { report_id: number | null }
    | undefined;
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const completeTask = db.transaction(() => {
    const insertRecord = db.prepare(
      'INSERT INTO COLLECTION_RECORD (task_id, bin_id, weight_kg, fill_status_after) VALUES (?, ?, ?, ?)'
    );
    const updateBin = db.prepare('UPDATE BIN SET fill_status = ?, last_emptied_at = datetime(\'now\') WHERE bin_id = ?');

    for (const r of records) {
      insertRecord.run(taskId, r.bin_id, r.weight_kg, r.fill_status_after);
      updateBin.run(r.fill_status_after, r.bin_id);
    }

    db.prepare("UPDATE COLLECTION_TASK SET status = 'COMPLETED', completed_at = datetime('now') WHERE task_id = ?").run(
      taskId
    );

    if (task.report_id) {
      db.prepare(
        "UPDATE WASTE_REPORT SET status = 'RESOLVED', resolved_at = datetime('now') WHERE report_id = ?"
      ).run(task.report_id);
      db.prepare(
        "INSERT INTO STATUS_LOG (report_id, old_status, new_status, changed_by) VALUES (?, 'ASSIGNED', 'RESOLVED', ?)"
      ).run(task.report_id, req.user!.id);
    }
  });

  completeTask();
  res.json({ completed: true });
});

// OPT-04: suggested visiting order for a worker's tasks today, using a simple
// nearest-neighbour walk from a fixed facilities-office origin.
const FACILITIES_OFFICE = { lat: 2.9279, lng: 101.6412 };

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * sinLng * sinLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

schedulingRouter.get('/tasks/suggested-order', requireAuth, requireRole('WORKER'), (req, res) => {
  const date = (req.query.date as string) ?? new Date().toISOString().slice(0, 10);

  const tasks = db
    .prepare(
      `SELECT t.task_id, t.priority, p.name AS point_name, p.latitude, p.longitude
       FROM COLLECTION_TASK t
       JOIN RECYCLING_POINT p ON p.point_id = t.point_id
       WHERE t.worker_id = ? AND t.scheduled_date = ? AND t.status IN ('ASSIGNED', 'IN_PROGRESS')`
    )
    .all(req.user!.id, date) as {
    task_id: number;
    priority: string;
    point_name: string;
    latitude: number | null;
    longitude: number | null;
  }[];

  const remaining = tasks.filter((t) => t.latitude != null && t.longitude != null);
  const ordered: typeof tasks = [];
  let current = FACILITIES_OFFICE;

  while (remaining.length > 0) {
    remaining.sort(
      (a, b) =>
        haversineKm(current, { lat: a.latitude!, lng: a.longitude! }) -
        haversineKm(current, { lat: b.latitude!, lng: b.longitude! })
    );
    const next = remaining.shift()!;
    ordered.push(next);
    current = { lat: next.latitude!, lng: next.longitude! };
  }

  res.json(ordered);
});
