import { api } from '@/lib/api/client';
import { authStorage } from '@/lib/auth';

const ROOT_TENANT = 'vaxa';

/** Opciones con el JWT del admin de Vaxa (empresa raíz). */
const opts = () => ({
  tenantId: ROOT_TENANT,
  token: authStorage.getToken(ROOT_TENANT) ?? undefined,
});

export interface EmpresaCreditos {
  id: number;
  razon_social: string;
  tenant_slug: string;
  dominio: string | null;
  ruc: string | null;
  logo_url: string | null;
  activo: number;
  creditos_disponibles: number;
  creditos_asignados_total: number;
  creditos_consumidos: number;
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

export interface UsuarioEmpresa {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  activo: number;
  rol_id: number;
  rol: string;
}

export interface Rol { id: number; nombre: string; descripcion: string | null; }

export interface CrearEmpresaDto {
  razon_social: string;
  tenant_slug?: string;
  dominio?: string;
  ruc?: string;
  logo?: string;
  creditos_iniciales?: number;
}

export interface EditarEmpresaDto {
  razon_social?: string;
  tenant_slug?: string;
  dominio?: string;
  ruc?: string;
  logo?: string;
  activo?: boolean;
}

export interface CrearUsuarioDto {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  rol_id: number;
}

export const creditosAdminApi = {
  listEmpresas: () =>
    api.get<EmpresaCreditos[]>('/api/admin/empresas', opts()),

  crearEmpresa: (dto: CrearEmpresaDto) =>
    api.post<EmpresaCreditos>('/api/admin/empresas', dto, opts()),

  editarEmpresa: (id: number, dto: EditarEmpresaDto) =>
    api.patch<EmpresaCreditos>(`/api/admin/empresas/${id}`, dto, opts()),

  recargar: (empresaId: number, cantidad: number, descripcion?: string) =>
    api.post<{ empresaId: number; saldo: number }>(
      `/api/admin/creditos/empresas/${empresaId}/recargar`,
      { cantidad, descripcion },
      opts(),
    ),

  movimientos: (empresaId: number, limit = 100) =>
    api.get<MovimientoCredito[]>(
      `/api/admin/creditos/empresas/${empresaId}/movimientos?limit=${limit}`,
      opts(),
    ),

  listUsuarios: (empresaId: number) =>
    api.get<UsuarioEmpresa[]>(`/api/admin/empresas/${empresaId}/usuarios`, opts()),

  crearUsuario: (empresaId: number, dto: CrearUsuarioDto) =>
    api.post<UsuarioEmpresa>(`/api/admin/empresas/${empresaId}/usuarios`, dto, opts()),

  listRoles: () =>
    api.get<Rol[]>('/api/admin/roles', opts()),
};
