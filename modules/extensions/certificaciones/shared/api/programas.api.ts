import { api } from '@/lib/api/client';
import { authStorage } from '@/lib/auth';
import type { Programa, CreateProgramaDto } from '../types';

const opts = (empresa: string) => ({
  tenantId: empresa,
  token: authStorage.getToken(empresa) ?? undefined,
});

export const programasApi = {
  list: (empresa: string) =>
    api.get<Programa[]>('/api/certificados/programas', opts(empresa)),

  get: (empresa: string, id: number) =>
    api.get<Programa>(`/api/certificados/programas/${id}`, opts(empresa)),

  create: (empresa: string, data: CreateProgramaDto) =>
    api.post<Programa>('/api/certificados/programas', data, opts(empresa)),

  update: (empresa: string, id: number, data: Partial<CreateProgramaDto>) =>
    api.patch<Programa>(`/api/certificados/programas/${id}`, data, opts(empresa)),
};
