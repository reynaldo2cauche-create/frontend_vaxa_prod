import { Outlet, useParams, Navigate } from 'react-router-dom';
import { getTenantConfig } from '@/lib/tenants';

export default function TenantLayout() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const tenant = tenantId ? getTenantConfig(tenantId) : null;

  if (!tenantId || !tenant) {
    return <Navigate to="/" replace />;
  }

  // certificaciones y sistemas-vaxa tienen su propio layout en cada módulo
  return <Outlet />;
}
