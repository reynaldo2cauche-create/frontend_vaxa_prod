import { notFound } from 'next/navigation';
import { getTenantConfig } from '@/lib/tenants';
import { loadModule } from '@/lib/module-loader';
import AuthGuard from '../AuthGuard';

interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function UsuariosPage({ params }: PageProps) {
  const { tenant: tenantId } = await params;
  const tenant = getTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  // Intentar cargar el módulo Usuarios
  let UsuariosModule;
  try {
    UsuariosModule = await loadModule('Usuarios', tenantId);
  } catch (error) {
    notFound();
  }

  return (
    <AuthGuard tenantId={tenantId}>
      <UsuariosModule tenantId={tenantId} tenant={tenant} />
    </AuthGuard>
  );
}
