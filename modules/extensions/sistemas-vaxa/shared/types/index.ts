// Tipos para sistemas-vaxa

export interface Sistema {
  id: string;
  nombre: string;
  tipo: 'certificados' | 'medico' | 'inventario';
  slug: string; // tenant ID (ej: 'empresa-techpro')
  estado: 'activo' | 'inactivo' | 'suspendido';
  planId: string;
  logoUrl?: string;
  logoEditableHasta?: string; // Fecha límite para editar logo
  firmasUrls?: string[];
  firmasEditablesHasta?: string;
  usuariosActivos: number;
  usuariosMax: number;
  certificadosGenerados?: number; // para sistemas de certificados
  certificadosMax?: number;
  fechaCreacion: string;
  fechaUltimaActividad: string;
}

export interface UsuarioSistema {
  id: string;
  sistemaId: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'operador' | 'usuario';
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  ultimoAcceso?: string;
}

export interface ConfiguracionSistema {
  sistemaId: string;
  logo: {
    url: string;
    bloqueado: boolean;
    fechaBloqueo?: string;
  };
  firmas: Array<{
    id: string;
    nombre: string;
    cargo: string;
    url: string;
    bloqueado: boolean;
    fechaBloqueo?: string;
  }>;
  colores: {
    primario: string;
    secundario: string;
  };
}

export interface Plan {
  id: string;
  nombre: string;
  precio: number;
  usuariosMax: number;
  certificadosMax: number; // -1 = ilimitado
  features: string[];
}
