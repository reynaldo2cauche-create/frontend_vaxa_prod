import { api } from '@/lib/api/client';
import { authStorage } from '@/lib/auth';
import type { ConfigCertificado, UpsertConfigDto } from '../types';

const opts = (empresa: string) => ({
  tenantId: empresa,
  token: authStorage.getToken(empresa) ?? undefined,
});

export const configApi = {
  get: (empresa: string, programaId: number) =>
    api.get<ConfigCertificado>(`/api/certificados/config/${programaId}`, opts(empresa)),

  upsert: (empresa: string, programaId: number, data: UpsertConfigDto) =>
    api.put<ConfigCertificado>(`/api/certificados/config/${programaId}`, data, opts(empresa)),
};
