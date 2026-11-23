// M2 Recycling Point and Bin Management: UC-05 Manage Recycling Points, UC-06 Manage Bins.
import { Router } from 'express';
import crypto from 'crypto';
import { db } from '../../db';
import { requireAuth, requireRole } from '../../middleware/auth';

export const pointsRouter = Router();

// FR-12: all users can view active recycling points and their bins.
pointsRouter.get('/', requireAuth, (_req, res) => {
  const points = db.prepare('SELECT * FROM RECYCLING_POINT WHERE is_active = 1 ORDER BY point_id').all();
  res.json(points);
});

pointsRouter.get('/:id/bins', requireAuth, (req, res) => {
  const bins = db
    .prepare('SELECT * FROM BIN WHERE point_id = ? AND is_active = 1 ORDER BY bin_id')
    .all(req.params.id);
  res.json(bins);
});

// FR-09: officer manages recycling points.
pointsRouter.post('/', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const { name, building, area_description, latitude, longitude } = req.body;
  const result = db
    .prepare(
      'INSERT INTO RECYCLING_POINT (name, building, area_description, latitude, longitude) VALUES (?, ?, ?, ?, ?)'
    )
    .run(name, building, area_description ?? null, latitude ?? null, longitude ?? null);
  res.status(201).json({ pointId: result.lastInsertRowid });
});

pointsRouter.put('/:id', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const { name, building, area_description, latitude, longitude } = req.body;
  db.prepare(
    'UPDATE RECYCLING_POINT SET name = ?, building = ?, area_description = ?, latitude = ?, longitude = ? WHERE point_id = ?'
  ).run(name, building, area_description ?? null, latitude ?? null, longitude ?? null, req.params.id);
  res.json({ updated: true });
});

pointsRouter.delete('/:id', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  // Points are deactivated, not deleted, so existing reports/records stay valid.
  db.prepare('UPDATE RECYCLING_POINT SET is_active = 0 WHERE point_id = ?').run(req.params.id);
  res.json({ deactivated: true });
});

// FR-10, FR-11: officer manages bins, each with a generated QR code.
pointsRouter.post('/:pointId/bins', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const { waste_type, capacity_litres } = req.body;
  const qrCode = crypto.randomBytes(8).toString('hex');
  const result = db
    .prepare(
      'INSERT INTO BIN (point_id, waste_type, capacity_litres, qr_code) VALUES (?, ?, ?, ?)'
    )
    .run(req.params.pointId, waste_type, capacity_litres ?? 100, qrCode);
  res.status(201).json({ binId: result.lastInsertRowid, qrCode });
});

pointsRouter.put('/bins/:binId', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  const { waste_type, capacity_litres, fill_status } = req.body;
  db.prepare('UPDATE BIN SET waste_type = ?, capacity_litres = ?, fill_status = ? WHERE bin_id = ?').run(
    waste_type,
    capacity_litres,
    fill_status,
    req.params.binId
  );
  res.json({ updated: true });
});

pointsRouter.delete('/bins/:binId', requireAuth, requireRole('OFFICER', 'ADMIN'), (req, res) => {
  db.prepare('UPDATE BIN SET is_active = 0 WHERE bin_id = ?').run(req.params.binId);
  res.json({ deactivated: true });
});

// Resolve a bin by its QR code, used to pre-fill the report form (FR-11).
pointsRouter.get('/bins/qr/:qrCode', requireAuth, (req, res) => {
  const bin = db.prepare('SELECT * FROM BIN WHERE qr_code = ? AND is_active = 1').get(req.params.qrCode);
  if (!bin) return res.status(404).json({ error: 'Bin not found' });
  res.json(bin);
});
