// ── Legacy types (usados por módulos anteriores — no usar en código nuevo) ──
/** @deprecated usar CertificadoPublico del nuevo módulo */
export interface DashboardMetrics {
  users: { total: number; active: number; new: number };
  sessions: { today: number; scheduled: number; completed: number };
  revenue: { currentMonth: number; previousMonth: number; growth: number };
  efficiency: { rate: number; trend: 'up' | 'down' | 'stable' };
}
/** @deprecated */
export interface ActivityItem { id: string; type: string; message: string; timestamp: string; metadata?: Record<string, unknown> }
/** @deprecated */
export interface SystemStatus { operational: boolean; database: boolean; api: boolean; lastCheck: string }
/** @deprecated */
export interface Empresa { id: string; nombre: string; tipo: string; logo?: string }

// ── Catálogos ──────────────────────────────────────────────────────────────
export interface TipoDocumento {
  id: number;
  codigo: string;
  nombre: string;
}

export interface TipoPrograma {
  id: number;
  nombre: string;
}

export interface Modalidad {
  id: number;
  codigo: string;
  nombre: string;
}

/** Coincide con la respuesta de GET /api/certificados/catalogos */
export interface Catalogos {
  tipos_documento: TipoDocumento[];
  tipos_programa: TipoPrograma[];
  modalidades: Modalidad[];
}

// ── Programa ────────────────────────────────────────────────────────────────
export interface Programa {
  id: number;
  empresa_id: number;
  tipo_programa_id: number;
  tipo_programa_nombre: string;
  nombre: string;
  descripcion: string | null;
  horas_academicas: number;
  activo: number;
}

export interface CreateProgramaDto {
  tipo_programa_id: number;
  nombre: string;
  descripcion?: string;
  horas_academicas: number;
}

// ── Grupo ───────────────────────────────────────────────────────────────────
export interface Grupo {
  id: number;
  empresa_id: number;
  programa_id: number;
  programa_nombre: string;
  nombre_grupo: string;
  fecha_inicio: string;
  fecha_fin: string;
  modalidad_id: number;
  modalidad_nombre: string;
  activo: number;
}

export interface CreateGrupoDto {
  programa_id: number;
  nombre_grupo: string;
  fecha_inicio: string;
  fecha_fin: string;
  modalidad_id: number;
}

// ── Participante ─────────────────────────────────────────────────────────────
export interface Participante {
  id: number;
  empresa_id: number;
  tipo_documento_id: number;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  email: string | null;
  telefono: string | null;
  activo: number;
}

export interface CreateParticipanteDto {
  tipo_documento_id: number;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
}

// ── Inscripción ──────────────────────────────────────────────────────────────
export interface Inscripcion {
  id: number;
  empresa_id: number;
  participante_id: number;
  participante_nombre: string;
  numero_documento: string;
  grupo_id: number;
  nombre_grupo: string;
  estado_id: number;
  estado_nombre: string;
  fecha_inscripcion: string;
}

export interface CreateInscripcionDto {
  participante_id: number;
  grupo_id: number;
}

export interface RegistroPublicoDto {
  tipo_documento_id: number;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  grupo_id: number;
}

// ── Certificado ──────────────────────────────────────────────────────────────
export interface Certificado {
  id: number;
  empresa_id: number;
  inscripcion_id: number;
  programa_id?: number;
  codigo_unico: string;
  url: string | null;
  fecha_emision: string;
  estado_id: number;
  estado_nombre: string;
  participante_nombre: string;
  numero_documento: string;
  programa_nombre: string;
  nombre_grupo: string;
}

export interface CertificadoPublico {
  codigo_unico: string;
  fecha_emision: string;
  url: string | null;
  participante_nombre: string;
  numero_documento: string;
  tipo_doc: string;
  programa_nombre: string;
  horas_academicas: number;
  nombre_grupo: string;
  fecha_inicio: string;
  fecha_fin: string;
  modalidad: string;
  estado: string;
  empresa_nombre: string;
  empresa_logo: string | null;
}

// ── Logo y Firma ─────────────────────────────────────────────────────────────
export interface Logo {
  id: number;
  empresa_id: number;
  nombre: string | null;
  imagen_logo: string;
  activo: number;
}

export interface Firma {
  id: number;
  empresa_id: number;
  nombre_autoridad: string;
  cargo: string;
  imagen_firma: string;
  activo: number;
}

// ── Config certificado ────────────────────────────────────────────────────────
export interface ConfigCertificado {
  empresa_id: number;
  programa_id: number;
  plantilla_url: string;
  firma_1_id: number | null;
  firma_2_id: number | null;
  logo_id: number | null;
  logo_imagen?: string | null;
  logo_nombre?: string | null;
  firma_1_nombre?: string | null;
  firma_1_cargo?: string | null;
  firma_1_imagen?: string | null;
  firma_2_nombre?: string | null;
  firma_2_cargo?: string | null;
  firma_2_imagen?: string | null;
}

export interface UpsertConfigDto {
  plantilla_url: string;
  firma_1_id?: number | null;
  firma_2_id?: number | null;
  logo_id?: number | null;
}
