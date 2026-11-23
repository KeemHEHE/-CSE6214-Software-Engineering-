import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../api';
import type { RecyclingPoint, WasteReport, CollectionTask, AppUser } from '../api';

const WASTE_TYPES = ['PAPER', 'PLASTIC', 'METAL', 'GLASS', 'EWASTE', 'GENERAL'];

interface DashboardData {
  weightByType: { waste_type: string; total_kg: number }[];
  weightByPoint: { point_name: string; total_kg: number }[];
  openReports: number;
  overdueTasks: number;
  avgResolutionHours: number;
}

export function OfficerDashboard() {
  const [points, setPoints] = useState<RecyclingPoint[]>([]);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [workers, setWorkers] = useState<AppUser[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [pointName, setPointName] = useState('');
  const [building, setBuilding] = useState('');

  async function refresh() {
    const [p, r, t, d] = await Promise.all([
      api.getPoints(),
      api.getReports(),
      api.getTasks(),
      api.getDashboard(),
    ]);
    setPoints(p);
    setReports(r);
    setTasks(t);
    setDashboard(d);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message));
    api
      .getUsers()
      .then((users) => setWorkers(users.filter((u) => u.role === 'WORKER')))
      .catch(() => undefined); // only ADMIN can list users; OFFICER falls back to entering worker IDs manually
  }, []);

  async function handleCreatePoint(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.createPoint({ name: pointName, building });
      setPointName('');
      setBuilding('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create point');
    }
  }

  async function handleAddBin(pointId: number, wasteType: string) {
    setError(null);
    try {
      await api.createBin(pointId, { waste_type: wasteType });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bin');
    }
  }

  async function handleResolve(id: number) {
    await api.resolveReport(id);
    await refresh();
  }

  async function handleReject(id: number) {
    await api.rejectReport(id);
    await refresh();
  }

  async function handleGenerateTasks() {
    await api.generateTasks();
    await refresh();
  }

  async function handleAssign(taskId: number, workerIdStr: string) {
    if (!workerIdStr) return;
    await api.assignTask(taskId, Number(workerIdStr));
    await refresh();
  }

  return (
    <div>
      <h1>Sustainability Officer Console</h1>
      {error && <p className="error">{error}</p>}

      {dashboard && (
        <div className="stats">
          <div className="stat-card">
            <strong>{dashboard.openReports}</strong>
            <span>Open Reports</span>
          </div>
          <div className="stat-card">
            <strong>{dashboard.overdueTasks}</strong>
            <span>Overdue Tasks</span>
          </div>
          <div className="stat-card">
            <strong>{dashboard.avgResolutionHours.toFixed(1)}h</strong>
            <span>Avg Resolution</span>
          </div>
        </div>
      )}

      <section>
        <h2>Recycling Points & Bins</h2>
        <form onSubmit={handleCreatePoint}>
          <input placeholder="Point name" value={pointName} onChange={(e) => setPointName(e.target.value)} required />
          <input placeholder="Building" value={building} onChange={(e) => setBuilding(e.target.value)} required />
          <button type="submit">Add Point</button>
        </form>
        {points.map((p) => (
          <div key={p.point_id}>
            <strong>{p.name}</strong> ({p.building})
            {WASTE_TYPES.map((wt) => (
              <button key={wt} onClick={() => handleAddBin(p.point_id, wt)}>
                + {wt} bin
              </button>
            ))}
          </div>
        ))}
      </section>

      <section>
        <h2>Reports Queue</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports
              .filter((r) => !['RESOLVED', 'REJECTED', 'DUPLICATE'].includes(r.status))
              .map((r) => (
                <tr key={r.report_id}>
                  <td>{r.report_id}</td>
                  <td>{r.category}</td>
                  <td>{r.priority}</td>
                  <td>{r.status}</td>
                  <td>
                    <button onClick={() => handleResolve(r.report_id)}>Resolve</button>
                    <button onClick={() => handleReject(r.report_id)}>Reject</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Collection Tasks</h2>
        <button onClick={handleGenerateTasks}>Generate Today's Tasks From Schedules</button>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Point</th>
              <th>Date</th>
              <th>Status</th>
              <th>Assign to</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.task_id}>
                <td>{t.task_id}</td>
                <td>{t.point_id}</td>
                <td>{t.scheduled_date}</td>
                <td>{t.status}</td>
                <td>
                  {t.status === 'UNASSIGNED' && (
                    <select defaultValue="" onChange={(e) => handleAssign(t.task_id, e.target.value)}>
                      <option value="">Select worker</option>
                      {workers.map((w) => (
                        <option key={w.user_id} value={w.user_id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {dashboard && (
        <section>
          <h2>Weight Collected by Type</h2>
          <ul>
            {dashboard.weightByType.map((w) => (
              <li key={w.waste_type}>
                {w.waste_type}: {w.total_kg} kg
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
