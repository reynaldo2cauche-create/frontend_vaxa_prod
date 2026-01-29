import { getTenantConfig } from '@/lib/tenants';
import { notFound } from 'next/navigation';
import { loadModule } from '@/lib/module-loader';
import AuthGuard from '../AuthGuard';

interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function HistorialPage({ params }: PageProps) {
  const { tenant: tenantId } = await params;
  const tenant = getTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  // Cargar módulo HistorialLotes usando el mismo sistema que Dashboard
  let HistorialModule;
  try {
    HistorialModule = await loadModule('HistorialLotes', tenantId);
  } catch (error) {
    // Si el tenant no tiene este módulo, 404
    notFound();
  }

  return (
    <AuthGuard tenantId={tenantId}>
      <HistorialModule tenantId={tenantId} tenant={tenant} />
    </AuthGuard>
  );
}
