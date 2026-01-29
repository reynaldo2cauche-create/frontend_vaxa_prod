import { notFound } from 'next/navigation';
import { getTenantConfig } from '@/lib/tenants';
import { loadModule } from '@/lib/module-loader';
import AuthGuard from '../AuthGuard';

interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function PlanesPage({ params }: PageProps) {
  const { tenant: tenantId } = await params;
  const tenant = getTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  // Intentar cargar el módulo Planes
  let PlanesModule;
  try {
    PlanesModule = await loadModule('Planes', tenantId);
  } catch (error) {
    notFound();
  }

  return (
    <AuthGuard tenantId={tenantId}>
      <PlanesModule tenantId={tenantId} tenant={tenant} />
    </AuthGuard>
  );
}
