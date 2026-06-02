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

  /** Busca por documento para autocompletar. Lanza error si no existe (404). */
  buscar: (empresa: string, documento: string, tipoDocumentoId?: number) =>
    api.get<Participante>(
      `/api/certificados/participantes/buscar?documento=${encodeURIComponent(documento)}${tipoDocumentoId ? `&tipo_documento_id=${tipoDocumentoId}` : ''}`,
      opts(empresa),
    ),

  create: (empresa: string, data: CreateParticipanteDto) =>
    api.post<Participante>('/api/certificados/participantes', data, opts(empresa)),
};
