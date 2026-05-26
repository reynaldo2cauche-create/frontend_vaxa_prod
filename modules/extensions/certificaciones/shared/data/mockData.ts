// Mock data legacy — solo usado por módulos del sistema anterior
// No usar en código nuevo; reemplazado por la API real

interface LegacyEmpresa { id: string; nombre: string; tipo: string; logo?: string }
interface LegacyParticipante { id: string; nombre: string; apellido: string; dni: string; email?: string }
interface LegacyCurso { id: string; nombre: string; duracion: string; fechaInicio: string; fechaFin: string }
interface LegacyFirma { nombre: string; cargo: string; imagenUrl: string }
interface LegacyCertificado {
  id: string; codigo: string; participante: LegacyParticipante; curso: LegacyCurso;
  instructor?: string; calificacion?: string; fechaEmision: string;
  empresa: LegacyEmpresa; firmas: LegacyFirma[]; estado: 'activo' | 'revocado';
}

const EMPRESAS: LegacyEmpresa[] = [
  { id: 'alpha', nombre: 'Alpha Corporation', tipo: 'Centro de Capacitación Empresarial', logo: '/videologo.png' },
  { id: 'beta',  nombre: 'Beta Industries',   tipo: 'Instituto de Formación Técnica' },
  { id: 'gamma', nombre: 'Gamma Academy',     tipo: 'Academia de Desarrollo Profesional' },
];

const CERTIFICADOS_MOCK: LegacyCertificado[] = [
  {
    id: '1', codigo: 'CERT-2024-001-ALPHA',
    participante: { id: 'p1', nombre: 'Juan Carlos', apellido: 'Pérez García', dni: '12345678', email: 'juan.perez@email.com' },
    curso: { id: 'c1', nombre: 'Gestión de Proyectos con Metodologías Ágiles', duracion: '40 horas', fechaInicio: '2024-01-15', fechaFin: '2024-02-15' },
    instructor: 'Dra. María Rodríguez', calificacion: 'Aprobado con Excelencia (95/100)', fechaEmision: '2024-02-20',
    empresa: EMPRESAS[0],
    firmas: [{ nombre: 'Dr. Roberto Sánchez', cargo: 'Director Académico', imagenUrl: '/firmas/firma1.png' }],
    estado: 'activo',
  },
];

export function getCertificadoByCodigo(codigo: string): LegacyCertificado | null {
  return CERTIFICADOS_MOCK.find(c => c.codigo.toUpperCase() === codigo.toUpperCase()) ?? null;
}
export function getAllCertificados(): LegacyCertificado[] { return CERTIFICADOS_MOCK; }
export function getCertificadosByEmpresa(empresaId: string): LegacyCertificado[] {
  return CERTIFICADOS_MOCK.filter(c => c.empresa.id === empresaId);
}
export function getAllEmpresas(): LegacyEmpresa[] { return EMPRESAS; }
