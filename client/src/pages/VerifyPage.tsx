import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export function VerifyPage() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.verify({ email, token });
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    }
  }

  return (
    <div className="auth-page">
      <h1>Verify Account</h1>
      <p>
        In this prototype, email sending is stubbed to the server console (no SMTP configured). Check the
        backend's console log for the verification token after registering.
      </p>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Verification token" value={token} onChange={(e) => setToken(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}
