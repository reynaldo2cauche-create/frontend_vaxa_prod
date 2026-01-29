// Datos estáticos en memoria para sistemas-vaxa

import type { Sistema, UsuarioSistema, ConfiguracionSistema } from '../types';

// Datos de sistemas registrados
export const SISTEMAS_MOCK: Sistema[] = [
  {
    id: '1',
    nombre: 'Empresa TechPro',
    tipo: 'certificados',
    slug: 'empresa-techpro',
    estado: 'activo',
    planId: 'profesional',
    logoUrl: '/videologo.png',
    logoEditableHasta: '2024-01-15', // Ya pasó, logo bloqueado
    firmasUrls: ['/firma1.png', '/firma2.png'],
    firmasEditablesHasta: '2024-01-15', // Ya pasó, firmas bloqueadas
    usuariosActivos: 12,
    usuariosMax: 20,
    certificadosGenerados: 345,
    certificadosMax: 500,
    fechaCreacion: '2024-01-10',
    fechaUltimaActividad: '2026-01-29',
  },
];

// Usuarios del sistema empresa-techpro
export const USUARIOS_MOCK: UsuarioSistema[] = [
  {
    id: '1',
    sistemaId: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@techpro.com',
    rol: 'admin',
    estado: 'activo',
    fechaCreacion: '2024-01-10',
    ultimoAcceso: '2026-01-29',
  },
  {
    id: '2',
    sistemaId: '1',
    nombre: 'María',
    apellido: 'García',
    email: 'maria.garcia@techpro.com',
    rol: 'operador',
    estado: 'activo',
    fechaCreacion: '2024-01-15',
    ultimoAcceso: '2026-01-28',
  },
  {
    id: '3',
    sistemaId: '1',
    nombre: 'Pedro',
    apellido: 'López',
    email: 'pedro.lopez@techpro.com',
    rol: 'usuario',
    estado: 'activo',
    fechaCreacion: '2024-01-20',
    ultimoAcceso: '2026-01-27',
  },
];

// Configuración de sistemas
export const CONFIGURACIONES_MOCK: ConfiguracionSistema[] = [
  {
    sistemaId: '1',
    logo: {
      url: '/videologo.png',
      bloqueado: true,
      fechaBloqueo: '2024-01-15',
    },
    firmas: [
      {
        id: 'f1',
        nombre: 'Dr. Carlos Ruiz',
        cargo: 'Director General',
        url: '/firma1.png',
        bloqueado: true,
        fechaBloqueo: '2024-01-15',
      },
      {
        id: 'f2',
        nombre: 'Ing. Ana Torres',
        cargo: 'Coordinadora de Capacitación',
        url: '/firma2.png',
        bloqueado: true,
        fechaBloqueo: '2024-01-15',
      },
    ],
    colores: {
      primario: '#ea6733',
      secundario: '#b63b19',
    },
  },
];
