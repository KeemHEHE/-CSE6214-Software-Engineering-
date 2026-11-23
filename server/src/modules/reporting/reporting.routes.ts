// M5 Recycling Performance Reporting and Notifications: dashboard, export,
// notifications, escalation. Also owns OPT-03 (trend analysis), per the
// subsystem ownership table.
import { Router } from 'express';
import { db } from '../../db';
import { requireAuth, requireRole } from '../../middleware/auth';

export const reportingRouter = Router();

// FR-26, FR-27: performance dashboard.
reportingRouter.get('/dashboard', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const from = (req.query.from as string) ?? '2000-01-01';
  const to = (req.query.to as string) ?? '2100-01-01';

  const weightByType = db
    .prepare(
      `SELECT b.waste_type, COALESCE(SUM(cr.weight_kg), 0) AS total_kg
       FROM COLLECTION_RECORD cr
       JOIN BIN b ON b.bin_id = cr.bin_id
       WHERE date(cr.recorded_at) BETWEEN ? AND ?
       GROUP BY b.waste_type`
    )
    .all(from, to);

  const weightByPoint = db
    .prepare(
      `SELECT p.name AS point_name, COALESCE(SUM(cr.weight_kg), 0) AS total_kg
       FROM COLLECTION_RECORD cr
       JOIN BIN b ON b.bin_id = cr.bin_id
       JOIN RECYCLING_POINT p ON p.point_id = b.point_id
       WHERE date(cr.recorded_at) BETWEEN ? AND ?
       GROUP BY p.point_id
       ORDER BY total_kg DESC
       LIMIT 5`
    )
    .all(from, to);

  const openReports = db
    .prepare("SELECT COUNT(*) AS count FROM WASTE_REPORT WHERE status IN ('SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED')")
    .get() as { count: number };

  const overdueTasks = db
    .prepare(
      "SELECT COUNT(*) AS count FROM COLLECTION_TASK WHERE status NOT IN ('COMPLETED', 'MISSED') AND scheduled_date < date('now')"
    )
    .get() as { count: number };

  const avgResolutionHours = db
    .prepare(
      `SELECT AVG((julianday(resolved_at) - julianday(created_at)) * 24) AS avg_hours
       FROM WASTE_REPORT WHERE resolved_at IS NOT NULL`
    )
    .get() as { avg_hours: number | null };

  res.json({
    weightByType,
    weightByPoint,
    openReports: openReports.count,
    overdueTasks: overdueTasks.count,
    avgResolutionHours: avgResolutionHours.avg_hours ?? 0,
  });
});

// FR-28: export monthly collection records as CSV (PDF export left as a follow-up).
reportingRouter.get('/export.csv', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const month = (req.query.month as string) ?? new Date().toISOString().slice(0, 7); // YYYY-MM

  const rows = db
    .prepare(
      `SELECT cr.record_id, p.name AS point_name, b.waste_type, cr.weight_kg, cr.fill_status_after, cr.recorded_at
       FROM COLLECTION_RECORD cr
       JOIN BIN b ON b.bin_id = cr.bin_id
       JOIN RECYCLING_POINT p ON p.point_id = b.point_id
       WHERE strftime('%Y-%m', cr.recorded_at) = ?
       ORDER BY cr.recorded_at`
    )
    .all(month) as Record<string, unknown>[];

  const header = 'record_id,point_name,waste_type,weight_kg,fill_status_after,recorded_at';
  const csv = [header, ...rows.map((r) => Object.values(r).join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="collection-report-${month}.csv"`);
  res.send(csv);
});

// OPT-03: weekly waste trend, flagging weeks that rise >30% over the trailing 4-week average.
reportingRouter.get('/trends', requireAuth, requireRole('OFFICER', 'ADMIN'), (_req, res) => {
  const weekly = db
    .prepare(
      `SELECT strftime('%Y-%W', cr.recorded_at) AS week, SUM(cr.weight_kg) AS total_kg
       FROM COLLECTION_RECORD cr
       GROUP BY week
       ORDER BY week`
    )
    .all() as { week: string; total_kg: number }[];

  const withSpikes = weekly.map((entry, i) => {
    const priorWeeks = weekly.slice(Math.max(0, i - 4), i);
    const avg = priorWeeks.length
      ? priorWeeks.reduce((sum, w) => sum + w.total_kg, 0) / priorWeeks.length
      : null;
    const spike = avg !== null && avg > 0 && entry.total_kg > avg * 1.3;
    return { ...entry, trailingAverage: avg, spike };
  });

  res.json(withSpikes);
});

// FR-29, FR-30: notifications.
reportingRouter.get('/notifications', requireAuth, (req, res) => {
  const notifications = db
    .prepare('SELECT * FROM NOTIFICATION WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user!.id);
  res.json(notifications);
});

reportingRouter.patch('/notifications/:id/read', requireAuth, (req, res) => {
  db.prepare('UPDATE NOTIFICATION SET is_read = 1 WHERE notification_id = ? AND user_id = ?').run(
    req.params.id,
    req.user!.id
  );
  res.json({ updated: true });
});

// FR-31: escalate HIGH priority reports with no action for 4 working hours.
// In production this runs as a node-cron job; exposed here for demos/testing.
reportingRouter.post('/escalate', requireAuth, requireRole('OFFICER', 'ADMIN'), (_req, res) => {
  const stale = db
    .prepare(
      `SELECT report_id FROM WASTE_REPORT
       WHERE priority = 'HIGH' AND status IN ('SUBMITTED', 'UNDER_REVIEW')
         AND created_at <= datetime('now', '-4 hours')`
    )
    .all() as { report_id: number }[];

  const officers = db.prepare("SELECT user_id FROM USER WHERE role = 'OFFICER'").all() as { user_id: number }[];
  const insertNotification = db.prepare(
    'INSERT INTO NOTIFICATION (user_id, type, message) VALUES (?, ?, ?)'
  );

  stale.forEach((r) => {
    officers.forEach((o) =>
      insertNotification.run(o.user_id, 'escalation', `Report #${r.report_id} (HIGH) has had no action for 4 hours`)
    );
  });

  res.json({ escalated: stale.length });
});
