'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TenantConfig } from '@/lib/tenants';
import {
  Users,
  Search,
  Download,
  Edit2,
  X,
  Loader2,
  CheckCircle2,
  FileText,
  Filter,
  Eye,
  ArrowLeft,
  Star,
  AlertCircle
} from 'lucide-react';
import { TENANT_CONFIG } from '../../shared/constants';
import { Header } from '../../shared/components';

interface CertificadosProps {
  tenantId: string;
  tenant: TenantConfig;
  loteId: string;
}

interface Usuario {
  email: string;
  nombre: string;
  role: string;
}

interface Participante {
  certificado_id: number;
  codigo: string;
  participante_id: number;
  termino: string | null;
  nombres: string;
  apellidos: string;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  correo_electronico: string | null;
  curso: string;
  horas: number;
  fecha_emision: string;
  nombre_actual?: string;
  tiene_override?: boolean;
}

// Datos estáticos de ejemplo para certificados
const generarCertificadosEstaticos = (loteId: string): Participante[] => {
  const cursos: Record<string, { curso: string; horas: number }> = {
    '1': { curso: 'Capacitación en Seguridad Industrial', horas: 40 },
    '2': { curso: 'Curso de Liderazgo Empresarial', horas: 32 },
    '3': { curso: 'Taller de Innovación Digital', horas: 28 },
    '4': { curso: 'Seminario de Gestión de Proyectos', horas: 56 }
  };

  const cursoData = cursos[loteId] || { curso: 'Curso General', horas: 24 };

  const participantes = [
    { nombres: 'Juan Carlos', apellidos: 'Pérez García', documento: '45678901', email: 'juan.perez@email.com' },
    { nombres: 'María Elena', apellidos: 'Rodríguez López', documento: '45678902', email: 'maria.rodriguez@email.com' },
    { nombres: 'Pedro José', apellidos: 'González Martínez', documento: '45678903', email: 'pedro.gonzalez@email.com' },
    { nombres: 'Ana María', apellidos: 'Torres Sánchez', documento: '45678904', email: 'ana.torres@email.com' },
    { nombres: 'Luis Alberto', apellidos: 'Ramírez Flores', documento: '45678905', email: 'luis.ramirez@email.com' },
    { nombres: 'Carmen Rosa', apellidos: 'Díaz Herrera', documento: '45678906', email: 'carmen.diaz@email.com' },
    { nombres: 'Jorge Luis', apellidos: 'Vargas Castro', documento: '45678907', email: 'jorge.vargas@email.com' },
    { nombres: 'Patricia', apellidos: 'Mendoza Ruiz', documento: '45678908', email: 'patricia.mendoza@email.com' },
    { nombres: 'Roberto', apellidos: 'Cruz Romero', documento: '45678909', email: 'roberto.cruz@email.com' },
    { nombres: 'Sofía', apellidos: 'Morales Ortiz', documento: '45678910', email: 'sofia.morales@email.com' },
    { nombres: 'Fernando', apellidos: 'Gutiérrez Rojas', documento: '45678911', email: 'fernando.gutierrez@email.com' },
    { nombres: 'Laura', apellidos: 'Paredes Vega', documento: '45678912', email: 'laura.paredes@email.com' },
    { nombres: 'Andrés', apellidos: 'Castillo Reyes', documento: '45678913', email: 'andres.castillo@email.com' },
    { nombres: 'Daniela', apellidos: 'Salazar Muñoz', documento: '45678914', email: 'daniela.salazar@email.com' },
    { nombres: 'Mauricio', apellidos: 'Ríos Campos', documento: '45678915', email: 'mauricio.rios@email.com' }
  ];

  return participantes.map((p, index) => ({
    certificado_id: parseInt(loteId) * 100 + index + 1,
    codigo: `CERT-${loteId}-${String(index + 1).padStart(4, '0')}`,
    participante_id: index + 1,
    termino: index % 3 === 0 ? 'Sr.' : index % 3 === 1 ? 'Sra.' : null,
    nombres: p.nombres,
    apellidos: p.apellidos,
    nombre_completo: `${p.nombres} ${p.apellidos}`,
    tipo_documento: 'DNI',
    numero_documento: p.documento,
    correo_electronico: p.email,
    curso: cursoData.curso,
    horas: cursoData.horas,
    fecha_emision: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }));
};

export default function CertificadosLote({ tenantId, tenant, loteId }: CertificadosProps) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [filteredParticipantes, setFilteredParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [editandoCertificado, setEditandoCertificado] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [regenerando, setRegenerando] = useState<number | null>(null);

  const [sortField, setSortField] = useState<'nombre' | 'documento' | 'fecha'>('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // Verificar autenticación
    const authData = localStorage.getItem(`auth_${tenantId}`);
    const userData = localStorage.getItem(`auth_user_${tenantId}`);

    if (!authData || authData !== 'true') {
      router.push(`/${tenantId}/login`);
      return;
    }

    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUsuario(user);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        router.push(`/${tenantId}/login`);
        return;
      }
    }

    // Cargar certificados estáticos
    const certs = generarCertificadosEstaticos(loteId);
    setParticipantes(certs);
    setLoading(false);
  }, [tenantId, loteId, router]);

  useEffect(() => {
    filterAndSortParticipantes();
    setCurrentPage(1);
  }, [participantes, searchTerm, sortField, sortOrder]);

  const filterAndSortParticipantes = () => {
    let filtered = [...participantes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nombre_completo.toLowerCase().includes(term) ||
          (p.nombre_actual && p.nombre_actual.toLowerCase().includes(term)) ||
          p.numero_documento.includes(term) ||
          p.correo_electronico?.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'nombre':
          comparison = a.apellidos.localeCompare(b.apellidos);
          break;
        case 'documento':
          comparison = a.numero_documento.localeCompare(b.numero_documento);
          break;
        case 'fecha':
          comparison = new Date(a.fecha_emision).getTime() - new Date(b.fecha_emision).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredParticipantes(filtered);
  };

  const iniciarEdicionCertificado = (participante: Participante) => {
    setEditandoCertificado(participante.certificado_id);
    setNombreEditado(participante.nombre_actual || participante.nombre_completo);
  };

  const cancelarEdicionCertificado = () => {
    setEditandoCertificado(null);
    setNombreEditado('');
  };

  const guardarYRegenerar = async (certificadoId: number) => {
    if (!nombreEditado.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    setRegenerando(certificadoId);

    try {
      // Simular guardado y regeneración
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Actualizar localmente
      setParticipantes((prev) =>
        prev.map((p) =>
          p.certificado_id === certificadoId
            ? {
                ...p,
                nombre_actual: nombreEditado,
                tiene_override: true
              }
            : p
        )
      );

      setEditandoCertificado(null);
      setNombreEditado('');
      alert('Certificado actualizado y regenerado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al regenerar el certificado');
    } finally {
      setRegenerando(null);
    }
  };

  const downloadCertificate = async (certificadoId: number, codigo: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log(`Descargando certificado ${codigo}`);
      alert(`Descargando certificado ${codigo}`);
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('Error al descargar el certificado');
    }
  };

  const previewCertificate = (certificadoId: number, codigo: string) => {
    alert(`Vista previa de certificado ${codigo} - Funcionalidad pendiente de implementar`);
  };

  const toggleSort = (field: 'nombre' | 'documento' | 'fecha') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Error: No se pudo cargar la información</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: participantes.length
  };

  const totalPages = Math.ceil(filteredParticipantes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParticipantes = filteredParticipantes.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* HEADER NAVBAR */}
      <Header tenantId={tenantId} usuario={usuario} />

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de página con botón volver */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/${tenantId}/historial`)}
            className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 mb-6 px-4 py-2 rounded-lg transition-all font-medium hover:text-gray-900 animate-[fadeIn_0.5s_ease-out]"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Historial
          </button>

          <div className="flex items-center gap-4 mb-6 animate-[slideUp_0.6s_ease-out_0.1s_both]">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
              }}
            >
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Lote #{loteId}</h1>
              <p className="text-sm text-gray-600 font-medium">
                {stats.total} certificados - {participantes[0]?.curso || 'Curso'}
              </p>
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, DNI o correo..."
                className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none transition-all text-sm shadow-sm"
                style={{
                  borderColor: searchTerm ? TENANT_CONFIG.PRIMARY_COLOR : undefined
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-semibold">Ordenar:</span>
            <button
              onClick={() => toggleSort('nombre')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                sortField === 'nombre'
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={
                sortField === 'nombre'
                  ? {
                      background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                    }
                  : undefined
              }
            >
              Nombre {sortField === 'nombre' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('documento')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                sortField === 'documento'
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={
                sortField === 'documento'
                  ? {
                      background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                    }
                  : undefined
              }
            >
              Documento {sortField === 'documento' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('fecha')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                sortField === 'fecha'
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={
                sortField === 'fecha'
                  ? {
                      background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                    }
                  : undefined
              }
            >
              Fecha {sortField === 'fecha' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Nombre en Certificado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentParticipantes.map((participante, index) => {
                  const isEditingCert = editandoCertificado === participante.certificado_id;
                  const globalIndex = startIndex + index + 1;

                  return (
                    <tr
                      key={participante.certificado_id}
                      className="hover:bg-purple-50/30 transition-colors"
                      style={{
                        animation: `fadeIn 0.5s ease-out ${0.2 + index * 0.05}s both`
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-9 h-9 text-sm font-bold text-gray-700 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-sm">
                          {globalIndex}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <span
                            className="inline-flex items-center gap-2 text-xs font-mono font-bold px-3 py-2 rounded-xl shadow-md border-2 w-fit"
                            style={{
                              backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}10`,
                              color: TENANT_CONFIG.PRIMARY_COLOR,
                              borderColor: `${TENANT_CONFIG.PRIMARY_COLOR}30`
                            }}
                          >
                            <FileText className="w-4 h-4" />
                            {participante.codigo}
                          </span>
                          {participante.tiene_override && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-bold bg-purple-100 px-2 py-1 rounded-lg w-fit">
                              <Star className="w-3.5 h-3.5 fill-purple-600" />
                              Personalizado
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {isEditingCert ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={nombreEditado}
                              onChange={(e) => setNombreEditado(e.target.value)}
                              className="w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none text-sm font-medium shadow-sm"
                              style={{
                                borderColor: TENANT_CONFIG.PRIMARY_COLOR
                              }}
                              placeholder="Nombre completo..."
                              disabled={regenerando === participante.certificado_id}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => guardarYRegenerar(participante.certificado_id)}
                                disabled={regenerando === participante.certificado_id}
                                className="flex items-center gap-2 px-4 py-2 text-white rounded-xl hover:opacity-90 transition-all text-sm font-bold shadow-lg disabled:opacity-50"
                                style={{
                                  background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                                }}
                              >
                                {regenerando === participante.certificado_id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Regenerando...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Guardar
                                  </>
                                )}
                              </button>
                              <button
                                onClick={cancelarEdicionCertificado}
                                disabled={regenerando === participante.certificado_id}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                              >
                                <X className="w-4 h-4" />
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {participante.nombre_actual || participante.nombre_completo}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 font-medium">
                                DNI: {participante.numero_documento}
                              </p>
                            </div>
                            <button
                              onClick={() => iniciarEdicionCertificado(participante)}
                              className="flex items-center gap-2 px-4 py-2 text-purple-700 hover:bg-purple-100 rounded-xl transition-all text-sm font-bold shadow-sm"
                            >
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-green-100 text-green-800 border-2 border-green-200 shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Activo
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              previewCertificate(participante.certificado_id, participante.codigo)
                            }
                            className="p-2.5 text-blue-700 hover:bg-blue-100 rounded-xl transition-all shadow-sm"
                            title="Vista previa"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              downloadCertificate(participante.certificado_id, participante.codigo)
                            }
                            className="p-2.5 text-green-700 hover:bg-green-100 rounded-xl transition-all shadow-sm"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredParticipantes.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No se encontraron certificados
              </h3>
              <p className="text-sm text-gray-500">
                {searchTerm
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Este lote no tiene certificados registrados'}
              </p>
            </div>
          )}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="mt-6 bg-white rounded-3xl shadow-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-600 font-medium">
                Mostrando <span className="font-bold text-gray-900">{startIndex + 1}</span> -{' '}
                <span className="font-bold text-gray-900">{Math.min(endIndex, filteredParticipantes.length)}</span> de{' '}
                <span className="font-bold text-gray-900">{filteredParticipantes.length}</span> participantes
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Primera
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Anterior
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all shadow-md ${
                          currentPage === pageNum
                            ? 'text-white scale-110'
                            : 'text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50'
                        }`}
                        style={
                          currentPage === pageNum
                            ? {
                                background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                              }
                            : undefined
                        }
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Siguiente
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Última
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONSEJOS */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-3xl p-6 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-700 mt-1 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-bold mb-2 text-base">Consejos:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800 font-medium">
                <li>Haz clic en <strong>Editar</strong> para modificar el nombre en el certificado</li>
                <li>Los cambios se guardan y el PDF se regenera automáticamente</li>
                <li>Los certificados personalizados muestran un icono de <strong>estrella</strong></li>
                <li>Usa <strong>vista previa</strong> para ver el certificado actualizado</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
