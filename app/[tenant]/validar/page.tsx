import { notFound } from 'next/navigation';
import { getTenantConfig } from '@/lib/tenants';
import { loadModule } from '@/lib/module-loader';

interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function ValidarPage({ params }: PageProps) {
  const { tenant: tenantId } = await params;
  const tenant = getTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  // Cargar módulo de Validación
  let ValidacionModule;
  try {
    ValidacionModule = await loadModule('Validacion', tenantId);
  } catch (error) {
    notFound();
  }

  return <ValidacionModule tenantId={tenantId} tenant={tenant} />;
}
