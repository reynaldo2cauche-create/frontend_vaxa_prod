import { getTenantConfig } from '@/lib/tenants';
import { notFound } from 'next/navigation';
import HistorialLotes from '@/modules/extensions/empresa-techpro/modules/HistorialLotes';

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

  // Solo empresa-techpro tiene esta funcionalidad por ahora
  if (tenantId !== 'empresa-techpro') {
    notFound();
  }

  return <HistorialLotes tenantId={tenantId} tenant={tenant} />;
}
