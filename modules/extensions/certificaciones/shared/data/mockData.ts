import { Certificado, Empresa } from '../types';

// Empresas clientes (tenants) que usan el sistema VAXA
const EMPRESAS: Empresa[] = [
  {
    id: 'alpha',
    nombre: 'Alpha Corporation',
    tipo: 'Centro de Capacitación Empresarial',
    logo: '/videologo.png',
  },
  {
    id: 'beta',
    nombre: 'Beta Industries',
    tipo: 'Instituto de Formación Técnica',
    logo: '/logos/beta-industries.png',
  },
  {
    id: 'gamma',
    nombre: 'Gamma Academy',
    tipo: 'Academia de Desarrollo Profesional',
    logo: '/logos/gamma-academy.png',
  },
];

// Certificados de ejemplo
const CERTIFICADOS_MOCK: Certificado[] = [
  {
    id: '1',
    codigo: 'CERT-2024-001-ALPHA',
    participante: {
      id: 'p1',
      nombre: 'Juan Carlos',
      apellido: 'Pérez García',
      dni: '12345678',
      email: 'juan.perez@email.com',
    },
    curso: {
      id: 'c1',
      nombre: 'Gestión de Proyectos con Metodologías Ágiles',
      duracion: '40 horas',
      fechaInicio: '2024-01-15',
      fechaFin: '2024-02-15',
    },
    instructor: 'Dra. María Rodríguez',
    calificacion: 'Aprobado con Excelencia (95/100)',
    fechaEmision: '2024-02-20',
    empresa: EMPRESAS[0], // Alpha Corporation
    firmas: [
      {
        nombre: 'Dr. Roberto Sánchez',
        cargo: 'Director Académico',
        imagenUrl: '/firmas/firma1.png',
      },
      {
        nombre: 'Ing. Patricia López',
        cargo: 'Gerente de Certificaciones',
        imagenUrl: '/firmas/firma2.png',
      },
    ],
    estado: 'activo',
  },
  {
    id: '2',
    codigo: 'CERT-2024-002-ALPHA',
    participante: {
      id: 'p2',
      nombre: 'Ana María',
      apellido: 'González Torres',
      dni: '87654321',
      email: 'ana.gonzalez@email.com',
    },
    curso: {
      id: 'c2',
      nombre: 'Liderazgo y Trabajo en Equipo',
      duracion: '30 horas',
      fechaInicio: '2024-02-01',
      fechaFin: '2024-02-28',
    },
    instructor: 'Lic. Fernando Morales',
    calificacion: 'Aprobado (88/100)',
    fechaEmision: '2024-03-05',
    empresa: EMPRESAS[0], // Alpha Corporation
    firmas: [
      {
        nombre: 'Dr. Roberto Sánchez',
        cargo: 'Director Académico',
        imagenUrl: '/firmas/firma1.png',
      },
    ],
    estado: 'activo',
  },
  {
    id: '3',
    codigo: 'CERT-2024-003-BETA',
    participante: {
      id: 'p3',
      nombre: 'Carlos Alberto',
      apellido: 'Ramírez Vega',
      dni: '45678912',
      email: 'carlos.ramirez@email.com',
    },
    curso: {
      id: 'c3',
      nombre: 'Programación Web Full Stack',
      duracion: '120 horas',
      fechaInicio: '2024-01-10',
      fechaFin: '2024-04-10',
    },
    instructor: 'Ing. Laura Fernández',
    calificacion: 'Aprobado con Distinción (92/100)',
    fechaEmision: '2024-04-15',
    empresa: EMPRESAS[1], // Beta Industries
    firmas: [
      {
        nombre: 'Ing. Miguel Ángel Castro',
        cargo: 'Director Técnico',
        imagenUrl: '/firmas/firma3.png',
      },
      {
        nombre: 'Lic. Andrea Jiménez',
        cargo: 'Coordinadora de Programas',
        imagenUrl: '/firmas/firma4.png',
      },
    ],
    estado: 'activo',
  },
  {
    id: '4',
    codigo: 'CERT-2024-004-GAMMA',
    participante: {
      id: 'p4',
      nombre: 'Sofía',
      apellido: 'Martínez Ruiz',
      dni: '78912345',
      email: 'sofia.martinez@email.com',
    },
    curso: {
      id: 'c4',
      nombre: 'Marketing Digital y Redes Sociales',
      duracion: '60 horas',
      fechaInicio: '2024-03-01',
      fechaFin: '2024-04-30',
    },
    instructor: 'Lic. Javier Torres',
    calificacion: 'Aprobado (90/100)',
    fechaEmision: '2024-05-05',
    empresa: EMPRESAS[2], // Gamma Academy
    firmas: [
      {
        nombre: 'Dra. Carmen Díaz',
        cargo: 'Directora General',
        imagenUrl: '/firmas/firma5.png',
      },
    ],
    estado: 'activo',
  },
];

// Función para buscar certificado por código
export function getCertificadoByCodigo(codigo: string): Certificado | null {
  const certificado = CERTIFICADOS_MOCK.find(
    (cert) => cert.codigo.toUpperCase() === codigo.toUpperCase()
  );
  return certificado || null;
}

// Función para obtener todos los certificados
export function getAllCertificados(): Certificado[] {
  return CERTIFICADOS_MOCK;
}

// Función para obtener certificados por empresa
export function getCertificadosByEmpresa(empresaId: string): Certificado[] {
  return CERTIFICADOS_MOCK.filter((cert) => cert.empresa.id === empresaId);
}

// Exportar empresas
export function getAllEmpresas(): Empresa[] {
  return EMPRESAS;
}

export type { Certificado, Empresa };