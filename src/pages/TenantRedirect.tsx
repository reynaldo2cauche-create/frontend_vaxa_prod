import { useParams, Navigate } from 'react-router-dom';
import { getTenantConfig } from '@/lib/tenants';

export default function TenantRedirect() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const tenant = tenantId ? getTenantConfig(tenantId) : null;

  if (!tenantId || !tenant) {
    return <Navigate to="/" replace />;
  }

  if (tenantId === 'sistemas-vaxa') {
    return <Navigate to={`/${tenantId}/sistemas`} replace />;
  }
  if (tenantId === 'certificaciones') {
    return <Navigate to={`/${tenantId}/login`} replace />;
  }

  const enabledModules = Object.entries(tenant.modules).filter(([, enabled]) => enabled);
  if (enabledModules.length === 1 && tenant.modules.dashboard) {
    return <Navigate to={`/${tenantId}/dashboard`} replace />;
  }

  return <Navigate to={`/${tenantId}/dashboard`} replace />;
}
