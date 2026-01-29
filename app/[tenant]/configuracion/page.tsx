import { notFound } from 'next/navigation';
import { getTenantConfig } from '@/lib/tenants';
import { loadModule } from '@/lib/module-loader';
import AuthGuard from '../AuthGuard';

interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function ConfiguracionPage({ params }: PageProps) {
  const { tenant: tenantId } = await params;
  const tenant = getTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  // Intentar cargar el módulo Configuracion
  let ConfiguracionModule;
  try {
    ConfiguracionModule = await loadModule('Configuracion', tenantId);
  } catch (error) {
    notFound();
  }

  return (
    <AuthGuard tenantId={tenantId}>
      <ConfiguracionModule tenantId={tenantId} tenant={tenant} />
    </AuthGuard>
  );
}
