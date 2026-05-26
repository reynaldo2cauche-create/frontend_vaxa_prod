import { api } from '@/lib/api/client';
import type { Catalogos, Grupo, RegistroPublicoDto } from '../types';

/** Endpoints públicos — no requieren JWT ni x-tenant-id header */
export const publicApi = {
  getCatalogos: (empresa: string) =>
    api.get<Catalogos>(`/public/certificados/${empresa}/catalogos`),

  getGrupos: (empresa: string) =>
    api.get<Grupo[]>(`/public/certificados/${empresa}/grupos`),

  registro: (empresa: string, data: RegistroPublicoDto) =>
    api.post<{ participante_id: number; inscripcion_id: number }>(
      `/public/certificados/${empresa}/registro`,
      data
    ),
};
