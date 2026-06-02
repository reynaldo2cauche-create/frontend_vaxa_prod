import { api } from '@/lib/api/client';
import { authStorage } from '@/lib/auth';

const opts = (empresa: string) => ({
  tenantId: empresa,
  token: authStorage.getToken(empresa) ?? undefined,
});

export interface EstadoCreditos {
  saldo: number;
  asignados_total: number;
}

export interface MovimientoCredito {
  id: number;
  tipo: 'asignacion' | 'recarga' | 'consumo' | 'devolucion' | 'ajuste';
  cantidad: number;
  saldo_resultante: number;
  certificado_id: number | null;
  descripcion: string | null;
  created_at: string;
}

export const creditosApi = {
  estado: (empresa: string) =>
    api.get<EstadoCreditos>('/api/certificados/creditos', opts(empresa)),

  movimientos: (empresa: string, limit = 100) =>
    api.get<MovimientoCredito[]>(`/api/certificados/creditos/movimientos?limit=${limit}`, opts(empresa)),
};
