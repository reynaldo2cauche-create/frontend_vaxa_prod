// Constantes para sistemas-vaxa (panel de administración)

export const VAXA_CONFIG = {
  NAME: 'Sistemas Vaxa',
  PRIMARY_COLOR: '#6366f1', // Indigo
  SECONDARY_COLOR: '#4f46e5',
  LOGO: '/vaxa-logo.png', // Logo del panel admin
};

// Tipos de sistemas que se pueden gestionar
export const TIPOS_SISTEMAS = {
  CERTIFICADOS: 'certificados',
  MEDICO: 'medico',
  INVENTARIO: 'inventario',
  // Agregar más tipos según se vayan creando
} as const;

// Estados de sistemas
export const ESTADOS_SISTEMA = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  SUSPENDIDO: 'suspendido',
} as const;

// Roles de usuarios en sistemas
export const ROLES_USUARIO = {
  ADMIN: 'admin',
  OPERADOR: 'operador',
  USUARIO: 'usuario',
} as const;

// Planes disponibles
export const PLANES = {
  BASICO: {
    id: 'basico',
    nombre: 'Básico',
    precio: 29.99,
    usuarios: 5,
    certificados: 100, // por mes
    features: ['5 usuarios', '100 certificados/mes', 'Soporte email'],
  },
  PROFESIONAL: {
    id: 'profesional',
    nombre: 'Profesional',
    precio: 79.99,
    usuarios: 20,
    certificados: 500,
    features: ['20 usuarios', '500 certificados/mes', 'Soporte prioritario', 'API access'],
  },
  EMPRESARIAL: {
    id: 'empresarial',
    nombre: 'Empresarial',
    precio: 199.99,
    usuarios: -1, // ilimitado
    certificados: -1, // ilimitado
    features: ['Usuarios ilimitados', 'Certificados ilimitados', 'Soporte 24/7', 'API ilimitado', 'Personalización avanzada'],
  },
} as const;
