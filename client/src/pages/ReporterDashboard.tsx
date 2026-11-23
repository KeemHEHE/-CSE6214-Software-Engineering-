import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../api';
import type { RecyclingPoint, Bin, WasteReport, LeaderboardEntry } from '../api';

const CATEGORIES = ['FULL_BIN', 'OVERFLOW', 'DAMAGED_BIN', 'CONTAMINATION', 'ILLEGAL_DUMPING', 'OTHER'];

export function ReporterDashboard() {
  const [points, setPoints] = useState<RecyclingPoint[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const [pointId, setPointId] = useState<number | ''>('');
  const [binId, setBinId] = useState<number | ''>('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [duplicateNotice, setDuplicateNotice] = useState<number | null>(null);

  async function refresh() {
    const [p, r, l] = await Promise.all([api.getPoints(), api.getReports(), api.getLeaderboard()]);
    setPoints(p);
    setReports(r);
    setLeaderboard(l);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!pointId) {
      setBins([]);
      return;
    }
    api.getBins(Number(pointId)).then(setBins).catch((err) => setError(err.message));
  }, [pointId]);

  async function submit(confirmDuplicate = false) {
    if (!pointId) return;
    setError(null);
    try {
      await api.submitReport({
        point_id: Number(pointId),
        bin_id: binId ? Number(binId) : undefined,
        category,
        description,
        confirmDuplicate,
      });
      setDescription('');
      setDuplicateNotice(null);
      await refresh();
    } catch (err) {
      if (err instanceof Error && err.message.includes('similar open report')) {
        setDuplicateNotice(1);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to submit report');
      }
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await submit(false);
  }

  return (
    <div>
      <h1>Report a Waste Issue</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <select value={pointId} onChange={(e) => setPointId(Number(e.target.value))} required>
          <option value="">Select a recycling point</option>
          {points.map((p) => (
            <option key={p.point_id} value={p.point_id}>
              {p.name} ({p.building})
            </option>
          ))}
        </select>
        <select value={binId} onChange={(e) => setBinId(Number(e.target.value))}>
          <option value="">(No specific bin)</option>
          {bins.map((b) => (
            <option key={b.bin_id} value={b.bin_id}>
              {b.waste_type} bin — {b.fill_status}
            </option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.replace('_', ' ')}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Describe the issue (max 500 characters)"
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {duplicateNotice && (
          <div>
            <p>A similar open report already exists for this bin in the last 24 hours.</p>
            <button type="button" onClick={() => submit(true)}>
              Submit anyway
            </button>
          </div>
        )}
        <button type="submit">Submit Report</button>
      </form>

      <h2>My Reports</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.report_id}>
              <td>{r.report_id}</td>
              <td>{r.category}</td>
              <td>{r.priority}</td>
              <td>{r.status}</td>
              <td>{r.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Recycling Rewards Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((l) => (
            <tr key={l.user_id}>
              <td>{l.name}</td>
              <td>{l.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
