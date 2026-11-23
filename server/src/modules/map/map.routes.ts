// OPT-02: interactive campus map with bin status and today's collection status.
import { Router } from 'express';
import { db } from '../../db';
import { requireAuth } from '../../middleware/auth';

export const mapRouter = Router();

mapRouter.get('/', requireAuth, (_req, res) => {
  const points = db
    .prepare('SELECT point_id, name, building, latitude, longitude FROM RECYCLING_POINT WHERE is_active = 1')
    .all() as { point_id: number; name: string; building: string; latitude: number; longitude: number }[];

  const bins = db
    .prepare('SELECT bin_id, point_id, waste_type, fill_status FROM BIN WHERE is_active = 1')
    .all() as { bin_id: number; point_id: number; waste_type: string; fill_status: string }[];

  const todaysTasks = db
    .prepare("SELECT point_id, status FROM COLLECTION_TASK WHERE scheduled_date = date('now')")
    .all() as { point_id: number; status: string }[];

  const result = points.map((p) => ({
    ...p,
    bins: bins.filter((b) => b.point_id === p.point_id),
    collectionStatusToday: todaysTasks.find((t) => t.point_id === p.point_id)?.status ?? 'NONE_SCHEDULED',
  }));

  res.json(result);
});
