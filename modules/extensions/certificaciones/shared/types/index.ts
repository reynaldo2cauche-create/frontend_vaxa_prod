// Tipos TypeScript específicos para empresa-techpro
// Tipos compartidos entre módulos del tenant

export interface DashboardMetrics {
  users: {
    total: number;
    active: number;
    new: number;
  };
  sessions: {
    today: number;
    scheduled: number;
    completed: number;
  };
  revenue: {
    currentMonth: number;
    previousMonth: number;
    growth: number;
  };
  efficiency: {
    rate: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface ActivityItem {
  id: string;
  type: 'system' | 'user' | 'action';
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SystemStatus {
  operational: boolean;
  database: boolean;
  api: boolean;
  lastCheck: string;
}

// Tipos para formularios específicos del tenant
export interface TechProFormData {
  // Agregar campos específicos según necesidades
  [key: string]: any;
}


// Tipos para el sistema de certificaciones

export interface Empresa {
  id: string;
  nombre: string;
  tipo: string; // "Centro de Capacitación", "Universidad", etc.
  logo?: string;
}

export interface Participante {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  email?: string;
}

export interface Curso {
  id: string;
  nombre: string;
  duracion: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface Firma {
  nombre: string;
  cargo: string;
  imagenUrl: string;
}

export interface Certificado {
  id: string;
  codigo: string;
  participante: Participante;
  curso: Curso;
  instructor?: string;
  calificacion?: string;
  fechaEmision: string;
  empresa: Empresa; // Empresa que emitió el certificado
  firmas: Firma[];
  estado: 'activo' | 'revocado';
}