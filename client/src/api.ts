const API_BASE = 'http://localhost:4000/api';

export type Role = 'STUDENT_STAFF' | 'WORKER' | 'OFFICER' | 'ADMIN';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // M1
  register: (data: { name: string; email: string; phone?: string; password: string }) =>
    request<{ userId: number; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  verify: (data: { email: string; token: string }) =>
    request<{ verified: boolean }>('/auth/verify', { method: 'POST', body: JSON.stringify(data) }),

  // M2
  getPoints: () => request<RecyclingPoint[]>('/points'),

  getBins: (pointId: number) => request<Bin[]>(`/points/${pointId}/bins`),

  createPoint: (data: { name: string; building: string; area_description?: string; latitude?: number; longitude?: number }) =>
    request<{ pointId: number }>('/points', { method: 'POST', body: JSON.stringify(data) }),

  createBin: (pointId: number, data: { waste_type: string; capacity_litres?: number }) =>
    request<{ binId: number; qrCode: string }>(`/points/${pointId}/bins`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // M3
  getReports: () => request<WasteReport[]>('/reports'),

  submitReport: (data: {
    point_id: number;
    bin_id?: number;
    category: string;
    description: string;
    confirmDuplicate?: boolean;
  }) => request<{ reportId: number }>('/reports', { method: 'POST', body: JSON.stringify(data) }),

  resolveReport: (id: number) => request<{ resolved: boolean }>(`/reports/${id}/resolve`, { method: 'PATCH' }),

  rejectReport: (id: number, reason?: string) =>
    request<{ rejected: boolean }>(`/reports/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) }),

  setReportPriority: (id: number, priority: 'LOW' | 'MEDIUM' | 'HIGH') =>
    request<{ updated: boolean }>(`/reports/${id}/priority`, { method: 'PATCH', body: JSON.stringify({ priority }) }),

  getLeaderboard: () => request<LeaderboardEntry[]>('/reports/leaderboard'),

  // M4
  createSchedule: (data: { point_id: number; waste_type?: string; time_slot: string; days: string[] }) =>
    request<{ scheduleId: number }>('/scheduling/schedules', { method: 'POST', body: JSON.stringify(data) }),

  generateTasks: (date?: string) =>
    request<{ generated: number; date: string }>('/scheduling/tasks/generate', {
      method: 'POST',
      body: JSON.stringify({ date }),
    }),

  getTasks: () => request<CollectionTask[]>('/scheduling/tasks'),

  startTask: (id: number) => request<{ started: boolean }>(`/scheduling/tasks/${id}/start`, { method: 'PATCH' }),

  completeTask: (id: number, records: { bin_id: number; weight_kg: number; fill_status_after: string }[]) =>
    request<{ completed: boolean }>(`/scheduling/tasks/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ records }),
    }),

  assignTask: (id: number, workerId: number) =>
    request<{ assigned: boolean }>(`/scheduling/tasks/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ worker_id: workerId }),
    }),

  getSuggestedOrder: () => request<CollectionTask[]>('/scheduling/tasks/suggested-order'),

  // M5
  getDashboard: () =>
    request<{
      weightByType: { waste_type: string; total_kg: number }[];
      weightByPoint: { point_name: string; total_kg: number }[];
      openReports: number;
      overdueTasks: number;
      avgResolutionHours: number;
    }>('/reporting/dashboard'),

  getTrends: () =>
    request<{ week: string; total_kg: number; trailingAverage: number | null; spike: boolean }[]>(
      '/reporting/trends'
    ),

  getNotifications: () => request<Notification[]>('/reporting/notifications'),

  // OPT-02
  getMap: () => request<MapPoint[]>('/map'),

  // M1 admin
  getUsers: () => request<AppUser[]>('/users'),

  createUser: (data: { name: string; email: string; password: string; role: Role; phone?: string }) =>
    request<{ userId: number }>('/users', { method: 'POST', body: JSON.stringify(data) }),

  setUserRole: (id: number, role: Role) =>
    request<{ updated: boolean }>(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),

  setUserStatus: (id: number, status: 'ACTIVE' | 'INACTIVE') =>
    request<{ updated: boolean }>(`/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

export interface AppUser {
  user_id: number;
  name: string;
  email: string;
  role: Role;
  status: string;
}

export interface RecyclingPoint {
  point_id: number;
  name: string;
  building: string;
  area_description: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: number;
}

export interface Bin {
  bin_id: number;
  point_id: number;
  waste_type: string;
  capacity_litres: number;
  fill_status: string;
  qr_code: string;
  is_active: number;
}

export interface WasteReport {
  report_id: number;
  reporter_id: number;
  point_id: number;
  bin_id: number | null;
  category: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
}

export interface CollectionTask {
  task_id: number;
  point_id: number;
  worker_id: number | null;
  waste_type: string | null;
  scheduled_date: string;
  priority: string;
  status: string;
  point_name?: string;
}

export interface Notification {
  notification_id: number;
  user_id: number;
  type: string;
  message: string;
  is_read: number;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: number;
  name: string;
  total_points: number;
}

export interface MapPoint {
  point_id: number;
  name: string;
  building: string;
  latitude: number;
  longitude: number;
  bins: { bin_id: number; waste_type: string; fill_status: string }[];
  collectionStatusToday: string;
}
