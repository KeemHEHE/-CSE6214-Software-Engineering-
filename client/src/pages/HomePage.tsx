import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const ROLE_HOME: Record<string, string> = {
  STUDENT_STAFF: '/reporter',
  WORKER: '/worker',
  OFFICER: '/officer',
  ADMIN: '/admin',
};

export function HomePage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role] ?? '/login'} replace />;
}
