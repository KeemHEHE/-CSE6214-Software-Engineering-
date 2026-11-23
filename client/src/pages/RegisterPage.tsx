import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const result = await api.register({ name, email, phone, password });
      setMessage(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <div className="auth-page">
      <h1>Register (Student / Staff)</h1>
      <p>Use your MMU email address (@mmu.edu.my or @student.mmu.edu.my).</p>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input
          type="email"
          placeholder="MMU email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        {message && <p>{message}</p>}
        <button type="submit">Register</button>
      </form>
      <p>
        Got a verification token? <Link to="/verify">Verify account</Link>
      </p>
      <p>
        Already verified? <button type="button" onClick={() => navigate('/login')}>Login</button>
      </p>
    </div>
  );
}
