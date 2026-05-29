import { api } from '@/lib/api/client';
import { authStorage } from '@/lib/auth';
import type { NotasMatriz } from '../types';

const opts = (empresa: string) => ({
  tenantId: empresa,
  token: authStorage.getToken(empresa) ?? undefined,
});

export interface NotaInput { unidad_id: number; nota: number; }

export const notasApi = {
  /** Matriz de notas de un grupo (unidades + alumnos + promedios). */
  matrizGrupo: (empresa: string, grupoId: number) =>
    api.get<NotasMatriz>(`/api/certificados/notas/grupo/${grupoId}`, opts(empresa)),

  /** Guarda las notas de un alumno; el backend recalcula su aprobación. */
  guardar: (empresa: string, inscripcionId: number, notas: NotaInput[]) =>
    api.put<{ estado_id: number; estado_nombre: string }>(
      `/api/certificados/notas/inscripcion/${inscripcionId}`,
      { notas },
      opts(empresa),
    ),
};
