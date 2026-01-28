import { getTenantConfig } from '@/lib/tenants';
import { notFound } from 'next/navigation';
import CertificadosLote from '@/modules/extensions/empresa-techpro/modules/Certificados';

interface PageProps {
  params: Promise<{
    tenant: string;
    loteId: string;
  }>;
}

export default async function CertificadosPage({ params }: PageProps) {
  const { tenant: tenantId, loteId } = await params;
  const tenant = getTenantConfig(tenantId);

  if (!tenant) {
    notFound();
  }

  // Solo empresa-techpro tiene esta funcionalidad por ahora
  if (tenantId !== 'empresa-techpro') {
    notFound();
  }

  return <CertificadosLote tenantId={tenantId} tenant={tenant} loteId={loteId} />;
}
