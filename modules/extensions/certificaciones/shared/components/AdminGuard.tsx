import { Navigate, Outlet, useParams } from 'react-router-dom';
import { authStorage } from '@/lib/auth';

export default function AdminGuard() {
  const { empresa } = useParams<{ empresa: string }>();

  if (!authStorage.isAuthenticated(empresa!)) {
    return <Navigate to={`/${empresa}/certificados/admin/login`} replace />;
  }

  return <Outlet />;
}
