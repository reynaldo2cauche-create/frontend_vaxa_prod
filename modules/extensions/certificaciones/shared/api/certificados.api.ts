import { api } from '@/lib/api/client';
import { authStorage } from '@/lib/auth';
import type { Certificado, CertificadoPublico } from '../types';

const opts = (empresa: string) => ({
  tenantId: empresa,
  token: authStorage.getToken(empresa) ?? undefined,
});

export const certificadosApi = {
  list: (empresa: string) =>
    api.get<Certificado[]>('/api/certificados/emision', opts(empresa)),

  generar: (empresa: string, inscripcionId: number) =>
    api.post<Certificado>(
      `/api/certificados/emision/generar/${inscripcionId}`,
      undefined,
      opts(empresa)
    ),

  anular: (empresa: string, id: number) =>
    api.patch<Certificado>(
      `/api/certificados/emision/${id}/anular`,
      undefined,
      opts(empresa)
    ),

  /** Endpoint público — no requiere token */
  validar: (codigo: string) =>
    api.get<CertificadoPublico>(`/public/certificado/${codigo}`),
};
