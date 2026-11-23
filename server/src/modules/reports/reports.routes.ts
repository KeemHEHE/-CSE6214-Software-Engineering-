// M3 Waste Reporting and Collection Management: UC-07, UC-08, UC-13.
// Also owns OPT-01 (rewards and leaderboard), per the subsystem ownership table.
import { Router } from 'express';
import { db } from '../../db';
import { requireAuth, requireRole } from '../../middleware/auth';

export const reportsRouter = Router();

const REWARD_POINTS_PER_RESOLVED_REPORT = 10;

function logStatusChange(reportId: number, oldStatus: string | null, newStatus: string, changedBy: number) {
  db.prepare(
    'INSERT INTO STATUS_LOG (report_id, old_status, new_status, changed_by) VALUES (?, ?, ?, ?)'
  ).run(reportId, oldStatus, newStatus, changedBy);
}

function notify(userId: number, type: string, message: string, link?: string) {
  db.prepare('INSERT INTO NOTIFICATION (user_id, type, message, link) VALUES (?, ?, ?, ?)').run(
    userId,
    type,
    message,
    link ?? null
  );
}

// FR-13, FR-18: submit a report, warning on likely duplicates.
reportsRouter.post('/', requireAuth, requireRole('STUDENT_STAFF'), (req, res) => {
  const { point_id, bin_id, category, description, photo_path, confirmDuplicate } = req.body;

  if (bin_id && !confirmDuplicate) {
    const existing = db
      .prepare(
        `SELECT report_id FROM WASTE_REPORT
         WHERE bin_id = ? AND category = ?
           AND status IN ('SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED')
           AND created_at >= datetime('now', '-1 day')`
      )
      .get(bin_id, category) as { report_id: number } | undefined;

    if (existing) {
      return res.status(409).json({
        error: 'A similar open report already exists for this bin in the last 24 hours',
        existingReportId: existing.report_id,
      });
    }
  }

  const result = db
    .prepare(
      'INSERT INTO WASTE_REPORT (reporter_id, point_id, bin_id, category, description, photo_path) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(req.user!.id, point_id, bin_id ?? null, category, description, photo_path ?? null);

  const reportId = Number(result.lastInsertRowid);
  logStatusChange(reportId, null, 'SUBMITTED', req.user!.id);

  const officers = db.prepare("SELECT user_id FROM USER WHERE role = 'OFFICER'").all() as { user_id: number }[];
  officers.forEach((o) => notify(o.user_id, 'new_report', `New report #${reportId} submitted`, `/reports/${reportId}`));

  res.status(201).json({ reportId });
});

// FR-15: reporters view their own reports; officers/admin view all.
reportsRouter.get('/', requireAuth, (req, res) => {
  const { role, id } = req.user!;
  const reports =
    role === 'STUDENT_STAFF'
      ? db.prepare('SELECT * FROM WASTE_REPORT WHERE reporter_id = ? ORDER BY created_at DESC').all(id)
      : db.prepare('SELECT * FROM WASTE_REPORT ORDER BY created_at DESC').all();
  res.json(reports);
});

reportsRouter.get('/:id/history', requireAuth, (req, res) => {
  const history = db
    .prepare('SELECT * FROM STATUS_LOG WHERE report_id = ? ORDER BY changed_at')
    .all(req.params.id);
  res.json(history);
});

// FR-16: officer reviews and resolves/rejects/marks duplicate/sets priority.
reportsRouter.patch('/:id/priority', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const { priority } = req.body as { priority: 'LOW' | 'MEDIUM' | 'HIGH' };
  db.prepare("UPDATE WASTE_REPORT SET priority = ?, status = 'UNDER_REVIEW' WHERE report_id = ?").run(
    priority,
    req.params.id
  );
  res.json({ updated: true });
});

reportsRouter.patch('/:id/resolve', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const report = db
    .prepare('SELECT reporter_id, status FROM WASTE_REPORT WHERE report_id = ?')
    .get(req.params.id) as { reporter_id: number; status: string } | undefined;
  if (!report) return res.status(404).json({ error: 'Report not found' });

  db.prepare("UPDATE WASTE_REPORT SET status = 'RESOLVED', resolved_at = datetime('now') WHERE report_id = ?").run(
    req.params.id
  );
  logStatusChange(Number(req.params.id), report.status, 'RESOLVED', req.user!.id);
  notify(report.reporter_id, 'report_resolved', `Your report #${req.params.id} was resolved`);

  // OPT-01: award points for a resolved report (one award per report).
  const alreadyAwarded = db.prepare('SELECT txn_id FROM REWARD_TRANSACTION WHERE report_id = ?').get(req.params.id);
  if (!alreadyAwarded) {
    db.prepare('INSERT INTO REWARD_TRANSACTION (user_id, report_id, points, reason) VALUES (?, ?, ?, ?)').run(
      report.reporter_id,
      req.params.id,
      REWARD_POINTS_PER_RESOLVED_REPORT,
      'Report resolved'
    );
  }

  res.json({ resolved: true });
});

reportsRouter.patch('/:id/reject', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const { reason } = req.body as { reason?: string };
  const report = db.prepare('SELECT reporter_id, status FROM WASTE_REPORT WHERE report_id = ?').get(req.params.id) as
    | { reporter_id: number; status: string }
    | undefined;
  if (!report) return res.status(404).json({ error: 'Report not found' });

  db.prepare('UPDATE WASTE_REPORT SET status = ? WHERE report_id = ?').run('REJECTED', req.params.id);
  logStatusChange(Number(req.params.id), report.status, 'REJECTED', req.user!.id);
  notify(report.reporter_id, 'report_rejected', `Your report #${req.params.id} was rejected${reason ? `: ${reason}` : ''}`);
  res.json({ rejected: true });
});

// FR-17: reports are never deleted, only closed as a duplicate.
reportsRouter.patch('/:id/mark-duplicate', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const { duplicateOfId } = req.body as { duplicateOfId: number };
  const report = db.prepare('SELECT status FROM WASTE_REPORT WHERE report_id = ?').get(req.params.id) as
    | { status: string }
    | undefined;
  if (!report) return res.status(404).json({ error: 'Report not found' });

  db.prepare('UPDATE WASTE_REPORT SET status = ?, duplicate_of_id = ? WHERE report_id = ?').run(
    'DUPLICATE',
    duplicateOfId,
    req.params.id
  );
  logStatusChange(Number(req.params.id), report.status, 'DUPLICATE', req.user!.id);
  res.json({ markedDuplicate: true });
});

// OPT-01: leaderboard of reward points by reporter.
reportsRouter.get('/leaderboard', requireAuth, (_req, res) => {
  const leaderboard = db
    .prepare(
      `SELECT u.user_id, u.name, COALESCE(SUM(rt.points), 0) AS total_points
       FROM USER u
       LEFT JOIN REWARD_TRANSACTION rt ON rt.user_id = u.user_id
       WHERE u.role = 'STUDENT_STAFF'
       GROUP BY u.user_id
       ORDER BY total_points DESC
       LIMIT 20`
    )
    .all();
  res.json(leaderboard);
});
