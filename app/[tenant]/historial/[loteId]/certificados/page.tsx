import { getTenantConfig } from '@/lib/tenants';
import { notFound } from 'next/navigation';
import { loadModule } from '@/lib/module-loader';
import AuthGuard from '../../../AuthGuard';

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

  // Cargar módulo Certificados usando el mismo sistema que Dashboard
  let CertificadosModule;
  try {
    CertificadosModule = await loadModule('Certificados', tenantId);
  } catch (error) {
    // Si el tenant no tiene este módulo, 404
    notFound();
  }

  return (
    <AuthGuard tenantId={tenantId}>
      <CertificadosModule tenantId={tenantId} tenant={tenant} loteId={loteId} />
    </AuthGuard>
  );
}
