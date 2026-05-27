import { api } from '@/lib/api/client';
import { authStorage } from '@/lib/auth';
import type { Inscripcion, CreateInscripcionDto, RegistroPublicoDto } from '../types';

const opts = (empresa: string) => ({
  tenantId: empresa,
  token: authStorage.getToken(empresa) ?? undefined,
});

export const inscripcionesApi = {
  list: (empresa: string, grupoId?: number) => {
    const qs = grupoId ? `?grupo_id=${grupoId}` : '';
    return api.get<Inscripcion[]>(`/api/certificados/inscripciones${qs}`, opts(empresa));
  },

  create: (empresa: string, data: CreateInscripcionDto) =>
    api.post<Inscripcion>('/api/certificados/inscripciones', data, opts(empresa)),

  cambiarEstado: (empresa: string, id: number, estado_id: number) =>
    api.patch<Inscripcion>(
      `/api/certificados/inscripciones/${id}/estado`,
      { estado_id },
      opts(empresa)
    ),

  /** Registro público: crea participante + inscripción en una sola operación */
  registroPublico: (empresa: string, data: RegistroPublicoDto) =>
    api.post<{ participante_id: number; inscripcion_id: number }>(
      '/api/certificados/inscripciones/registro-publico',
      data,
      { tenantId: empresa }
    ),
};
