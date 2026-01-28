import { getTenantConfig } from '@/lib/tenants';
import { notFound } from 'next/navigation';
import Participantes from '@/modules/extensions/empresa-techpro/modules/Participantes';

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

  // Solo empresa-techpro tiene esta funcionalidad por ahora
  if (tenantId !== 'empresa-techpro') {
    notFound();
  }

  return <Participantes tenantId={tenantId} tenant={tenant} />;
}
