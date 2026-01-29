import { getTenantConfig } from '@/lib/tenants';
import { notFound } from 'next/navigation';
import { loadModule } from '@/lib/module-loader';
import AuthGuard from '../AuthGuard';

interface PageProps {
  params: Promise<{
    tenant: string;
  }>;
}

export default async function ParticipantesPage({ params }: PageProps) {
  const { tenant: tenantId } = await params;
  const tenant = getTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  // Cargar módulo Participantes usando el mismo sistema que Dashboard
  let ParticipantesModule;
  try {
    ParticipantesModule = await loadModule('Participantes', tenantId);
  } catch (error) {
    // Si el tenant no tiene este módulo, 404
    notFound();
  }

  return (
    <AuthGuard tenantId={tenantId}>
      <ParticipantesModule tenantId={tenantId} tenant={tenant} />
    </AuthGuard>
  );
}
