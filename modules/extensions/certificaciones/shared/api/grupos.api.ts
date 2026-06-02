import { api } from '@/lib/api/client';
import { authStorage } from '@/lib/auth';
import type { Grupo, CreateGrupoDto } from '../types';

const opts = (empresa: string) => ({
  tenantId: empresa,
  token: authStorage.getToken(empresa) ?? undefined,
});

export const gruposApi = {
  list: (empresa: string) =>
    api.get<Grupo[]>('/api/certificados/grupos', opts(empresa)),

  get: (empresa: string, id: number) =>
    api.get<Grupo>(`/api/certificados/grupos/${id}`, opts(empresa)),

  create: (empresa: string, data: CreateGrupoDto) =>
    api.post<Grupo>('/api/certificados/grupos', data, opts(empresa)),
};
