import { useEffect, useState } from 'react';
import { api } from '../api';
import type { CollectionTask, Bin } from '../api';

const FILL_STATUSES = ['EMPTY', 'HALF', 'FULL', 'OVERFLOWING', 'DAMAGED'];

export function WorkerDashboard() {
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [suggestedOrder, setSuggestedOrder] = useState<CollectionTask[]>([]);
  const [binsByTask, setBinsByTask] = useState<Record<number, Bin[]>>({});
  const [weights, setWeights] = useState<Record<string, { weight_kg: string; fill_status_after: string }>>({});
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const [t, order] = await Promise.all([api.getTasks(), api.getSuggestedOrder()]);
    setTasks(t);
    setSuggestedOrder(order);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message));
  }, []);

  async function handleStart(taskId: number) {
    setError(null);
    try {
      await api.startTask(taskId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start task');
    }
  }

  async function loadBins(task: CollectionTask) {
    const bins = await api.getBins(task.point_id);
    setBinsByTask((prev) => ({ ...prev, [task.task_id]: bins }));
  }

  function setWeight(taskId: number, binId: number, field: 'weight_kg' | 'fill_status_after', value: string) {
    const key = `${taskId}-${binId}`;
    setWeights((prev) => {
      const current = prev[key] ?? { weight_kg: '0', fill_status_after: 'EMPTY' };
      return { ...prev, [key]: { ...current, [field]: value } };
    });
  }

  async function handleComplete(task: CollectionTask) {
    const bins = binsByTask[task.task_id] ?? [];
    const records = bins.map((b) => {
      const entry = weights[`${task.task_id}-${b.bin_id}`] ?? { weight_kg: '0', fill_status_after: 'EMPTY' };
      return {
        bin_id: b.bin_id,
        weight_kg: Number(entry.weight_kg),
        fill_status_after: entry.fill_status_after,
      };
    });

    setError(null);
    try {
      await api.completeTask(task.task_id, records);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete task');
    }
  }

  return (
    <div>
      <h1>My Collection Tasks</h1>
      {error && <p className="error">{error}</p>}

      <h2>Suggested Visiting Order (today)</h2>
      <ol>
        {suggestedOrder.map((t) => (
          <li key={t.task_id}>
            Task #{t.task_id} — {t.point_name} ({t.priority})
          </li>
        ))}
      </ol>

      <h2>All Tasks</h2>
      {tasks.map((task) => (
        <section key={task.task_id}>
          <h3>
            Task #{task.task_id} — {task.scheduled_date} — {task.status} ({task.priority})
          </h3>

          {task.status === 'ASSIGNED' && <button onClick={() => handleStart(task.task_id)}>Start</button>}

          {task.status === 'IN_PROGRESS' && (
            <div>
              {!binsByTask[task.task_id] && <button onClick={() => loadBins(task)}>Load bins to record</button>}
              {binsByTask[task.task_id]?.map((bin) => (
                <div key={bin.bin_id}>
                  <span>
                    Bin #{bin.bin_id} ({bin.waste_type}) —{' '}
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Weight (kg)"
                    onChange={(e) => setWeight(task.task_id, bin.bin_id, 'weight_kg', e.target.value)}
                  />
                  <select onChange={(e) => setWeight(task.task_id, bin.bin_id, 'fill_status_after', e.target.value)}>
                    {FILL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              {binsByTask[task.task_id] && <button onClick={() => handleComplete(task)}>Complete Task</button>}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
