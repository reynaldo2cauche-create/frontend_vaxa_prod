import { api } from '@/lib/api/client';
import { authStorage } from '@/lib/auth';
import type { Participante, CreateParticipanteDto } from '../types';

const opts = (empresa: string) => ({
  tenantId: empresa,
  token: authStorage.getToken(empresa) ?? undefined,
});

export const participantesApi = {
  list: (empresa: string) =>
    api.get<Participante[]>('/api/certificados/participantes', opts(empresa)),

  get: (empresa: string, id: number) =>
    api.get<Participante>(`/api/certificados/participantes/${id}`, opts(empresa)),

  create: (empresa: string, data: CreateParticipanteDto) =>
    api.post<Participante>('/api/certificados/participantes', data, opts(empresa)),
};
