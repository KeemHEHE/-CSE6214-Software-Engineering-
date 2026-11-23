import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../api';
import type { AppUser, Role } from '../api';

const ROLES: Role[] = ['STUDENT_STAFF', 'WORKER', 'OFFICER', 'ADMIN'];

export function AdminDashboard() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('WORKER');

  async function refresh() {
    setUsers(await api.getUsers());
  }

  useEffect(() => {
    refresh().catch((err) => setError(err.message));
  }, []);

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.createUser({ name, email, password, role });
      setName('');
      setEmail('');
      setPassword('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  }

  async function handleRoleChange(id: number, newRole: string) {
    await api.setUserRole(id, newRole as Role);
    await refresh();
  }

  async function handleToggleStatus(user: AppUser) {
    const newStatus = user.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    await api.setUserStatus(user.user_id, newStatus);
    await refresh();
  }

  return (
    <div>
      <h1>User Account Management</h1>
      {error && <p className="error">{error}</p>}

      <section>
        <h2>Create Worker / Officer / Admin Account</h2>
        <form onSubmit={handleCreateUser}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button type="submit">Create Account</button>
        </form>
      </section>

      <section>
        <h2>All Accounts</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => handleRoleChange(u.user_id, e.target.value)}>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{u.status}</td>
                <td>
                  <button onClick={() => handleToggleStatus(u)}>
                    {u.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
