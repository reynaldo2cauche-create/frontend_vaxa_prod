'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Download,
  Edit2,
  Save,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  Filter,
  Eye,
  ArrowLeft,
  Star,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TENANT_CONFIG } from '../../shared/constants';

interface Participante {
  certificado_id: number;
  codigo: string;
  nombre_completo: string;
  nombre_actual?: string;
  numero_documento: string;
  correo_electronico: string | null;
  fecha_emision: string;
  estado: 'activo' | 'revocado';
  tiene_override?: boolean;
}

// DATOS ESTÁTICOS DE EJEMPLO
const PARTICIPANTES_MOCK: Participante[] = [
  {
    certificado_id: 1,
    codigo: 'CERT-2024-001',
    nombre_completo: 'Juan Carlos Pérez García',
    numero_documento: '12345678',
    correo_electronico: 'juan.perez@email.com',
    fecha_emision: '2024-01-15',
    estado: 'activo'
  },
  {
    certificado_id: 2,
    codigo: 'CERT-2024-002',
    nombre_completo: 'María Isabel González López',
    numero_documento: '87654321',
    correo_electronico: 'maria.gonzalez@email.com',
    fecha_emision: '2024-01-15',
    estado: 'activo',
    tiene_override: true,
    nombre_actual: 'María I. González López'
  },
  {
    certificado_id: 3,
    codigo: 'CERT-2024-003',
    nombre_completo: 'Carlos Andrés Rodríguez Martínez',
    numero_documento: '45678912',
    correo_electronico: 'carlos.rodriguez@email.com',
    fecha_emision: '2024-01-15',
    estado: 'activo'
  },
  {
    certificado_id: 4,
    codigo: 'CERT-2024-004',
    nombre_completo: 'Ana Sofía Ramírez Torres',
    numero_documento: '78912345',
    correo_electronico: 'ana.ramirez@email.com',
    fecha_emision: '2024-01-15',
    estado: 'revocado'
  },
  {
    certificado_id: 5,
    codigo: 'CERT-2024-005',
    nombre_completo: 'Luis Fernando Díaz Sánchez',
    numero_documento: '32165498',
    correo_electronico: 'luis.diaz@email.com',
    fecha_emision: '2024-01-15',
    estado: 'activo'
  },
  {
    certificado_id: 6,
    codigo: 'CERT-2024-006',
    nombre_completo: 'Patricia Elena Morales Gutiérrez',
    numero_documento: '65498732',
    correo_electronico: 'patricia.morales@email.com',
    fecha_emision: '2024-01-15',
    estado: 'activo'
  },
  {
    certificado_id: 7,
    codigo: 'CERT-2024-007',
    nombre_completo: 'Roberto Miguel Castillo Fernández',
    numero_documento: '98765432',
    correo_electronico: 'roberto.castillo@email.com',
    fecha_emision: '2024-01-15',
    estado: 'activo',
    tiene_override: true,
    nombre_actual: 'Dr. Roberto M. Castillo'
  },
  {
    certificado_id: 8,
    codigo: 'CERT-2024-008',
    nombre_completo: 'Gabriela Andrea Vega Herrera',
    numero_documento: '15975348',
    correo_electronico: 'gabriela.vega@email.com',
    fecha_emision: '2024-01-15',
    estado: 'activo'
  },
  {
    certificado_id: 9,
    codigo: 'CERT-2024-009',
    nombre_completo: 'Diego Alejandro Torres Ruiz',
    numero_documento: '75395148',
    correo_electronico: null,
    fecha_emision: '2024-01-15',
    estado: 'activo'
  },
  {
    certificado_id: 10,
    codigo: 'CERT-2024-010',
    nombre_completo: 'Sandra Milena Jiménez Castro',
    numero_documento: '35795142',
    correo_electronico: 'sandra.jimenez@email.com',
    fecha_emision: '2024-01-15',
    estado: 'revocado'
  },
  {
    certificado_id: 11,
    codigo: 'CERT-2024-011',
    nombre_completo: 'Fernando José Mendoza Ríos',
    numero_documento: '85274196',
    correo_electronico: 'fernando.mendoza@email.com',
    fecha_emision: '2024-01-16',
    estado: 'activo'
  },
  {
    certificado_id: 12,
    codigo: 'CERT-2024-012',
    nombre_completo: 'Carolina Beatriz Silva Moreno',
    numero_documento: '96385274',
    correo_electronico: 'carolina.silva@email.com',
    fecha_emision: '2024-01-16',
    estado: 'activo'
  },
  {
    certificado_id: 13,
    codigo: 'CERT-2024-013',
    nombre_completo: 'Andrés Felipe Ortiz Navarro',
    numero_documento: '74185296',
    correo_electronico: 'andres.ortiz@email.com',
    fecha_emision: '2024-01-16',
    estado: 'activo'
  },
  {
    certificado_id: 14,
    codigo: 'CERT-2024-014',
    nombre_completo: 'Daniela Cristina Paredes Luna',
    numero_documento: '85296374',
    correo_electronico: 'daniela.paredes@email.com',
    fecha_emision: '2024-01-16',
    estado: 'activo',
    tiene_override: true,
    nombre_actual: 'Ing. Daniela C. Paredes'
  },
  {
    certificado_id: 15,
    codigo: 'CERT-2024-015',
    nombre_completo: 'Ricardo Emilio Vargas Campos',
    numero_documento: '36925874',
    correo_electronico: 'ricardo.vargas@email.com',
    fecha_emision: '2024-01-16',
    estado: 'activo'
  }
];

function PdfPreviewModal({
  isOpen,
  onClose,
  codigo
}: {
  isOpen: boolean;
  onClose: () => void;
  codigo: string;
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col animate-slideUp">
        {/* Header del Modal */}
        <div className="flex items-center justify-between p-7 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Vista Previa del Certificado
            </h3>
            <p className="text-sm text-gray-500 font-medium">Código: {codigo}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Contenido del PDF */}
        <div className="flex-1 relative bg-gray-50">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
              <span className="text-gray-600 font-medium">Cargando certificado...</span>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-10">
              <div className="bg-white rounded-2xl shadow-xl p-12 max-w-3xl w-full border-2 border-gray-200">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                    style={{ backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}20` }}>
                    <FileText className="w-10 h-10" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900">
                    Certificado de Participación
                  </h4>
                  <p className="text-gray-600 text-lg">
                    Este es un preview simulado del certificado
                  </p>
                  <div className="py-8 px-10 bg-gray-50 rounded-2xl">
                    <p className="text-sm text-gray-500 mb-2">Se otorga a:</p>
                    <p className="text-xl font-bold text-gray-900">Juan Carlos Pérez García</p>
                  </div>
                  <p className="text-sm text-gray-500">Código: {codigo}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer del Modal */}
        <div className="flex items-center justify-between p-7 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 font-medium">
            Vista previa generada en tiempo real
          </p>
          <button
            onClick={() => alert('Certificado descargado ✓')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})` }}
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ParticipantesLote() {
  const [participantes] = useState<Participante[]>(PARTICIPANTES_MOCK);
  const [filteredParticipantes, setFilteredParticipantes] = useState<Participante[]>(PARTICIPANTES_MOCK);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'activo' | 'revocado'>('todos');

  const [editandoCertificado, setEditandoCertificado] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [regenerando, setRegenerando] = useState<number | null>(null);

  const [sortField, setSortField] = useState<'nombre' | 'documento' | 'fecha'>('nombre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [previewPdf, setPreviewPdf] = useState<{
    isOpen: boolean;
    codigo: string;
  }>({
    isOpen: false,
    codigo: ''
  });

  const stats = {
    total: participantes.length,
    activos: participantes.filter(p => p.estado === 'activo').length,
    revocados: participantes.filter(p => p.estado === 'revocado').length
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

    // Simular guardado y regeneración
    setTimeout(() => {
      setEditandoCertificado(null);
      setNombreEditado('');
      setRegenerando(null);
      alert('¡Certificado regenerado exitosamente! 🎉');
    }, 2000);
  };

  const previewCertificate = (codigo: string) => {
    setPreviewPdf({
      isOpen: true,
      codigo
    });
  };

  const downloadCertificate = (codigo: string) => {
    alert(`Descargando certificado: ${codigo} ✓`);
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filtrado y ordenamiento
  useState(() => {
    let filtered = [...participantes];

    if (estadoFiltro !== 'todos') {
      filtered = filtered.filter(p => p.estado === estadoFiltro);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombre_completo.toLowerCase().includes(term) ||
        p.numero_documento.includes(term) ||
        p.codigo.toLowerCase().includes(term) ||
        (p.correo_electronico?.toLowerCase().includes(term))
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'nombre':
          comparison = a.nombre_completo.localeCompare(b.nombre_completo);
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
  });

  const totalPages = Math.ceil(filteredParticipantes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParticipantes = filteredParticipantes.slice(startIndex, endIndex);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <PdfPreviewModal
          isOpen={previewPdf.isOpen}
          onClose={() => setPreviewPdf({ isOpen: false, codigo: '' })}
          codigo={previewPdf.codigo}
        />

        {/* MAIN CONTENT */}
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Header con título y stats */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Certificados del Lote
                </h2>
                <p className="text-gray-600 text-lg font-medium">
                  Gestiona y visualiza todos los certificados generados
                </p>
              </div>
              <button
                onClick={() => alert('Navegando al dashboard...')}
                className="flex items-center gap-2 px-5 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}20` }}>
                    <Users className="w-7 h-7" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Total</span>
                </div>
                <p className="text-4xl font-bold mb-1" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }}>
                  {stats.total}
                </p>
                <p className="text-sm text-gray-500 font-medium">Certificados totales</p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-7 h-7 text-green-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Activos</span>
                </div>
                <p className="text-4xl font-bold text-green-600 mb-1">
                  {stats.activos}
                </p>
                <p className="text-sm text-gray-500 font-medium">Certificados activos</p>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <XCircle className="w-7 h-7 text-red-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Revocados</span>
                </div>
                <p className="text-4xl font-bold text-red-600 mb-1">
                  {stats.revocados}
                </p>
                <p className="text-sm text-gray-500 font-medium">Certificados revocados</p>
              </div>
            </div>
          </div>

          {/* FILTROS */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, DNI, código o correo..."
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 transition-all text-sm font-medium"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div>
                <select
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value as any)}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-400 transition-all text-sm font-medium"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activo">Solo activos</option>
                  <option value="revocado">Solo revocados</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600 font-semibold">Ordenar por:</span>
              <button
                onClick={() => toggleSort('nombre')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  sortField === 'nombre'
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={sortField === 'nombre' ? {
                  background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                } : {}}
              >
                Nombre {sortField === 'nombre' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => toggleSort('documento')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  sortField === 'documento'
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={sortField === 'documento' ? {
                  background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                } : {}}
              >
                Documento {sortField === 'documento' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => toggleSort('fecha')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  sortField === 'fecha'
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={sortField === 'fecha' ? {
                  background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                } : {}}
              >
                Fecha {sortField === 'fecha' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>

          {/* TABLA */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Nombre en Certificado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
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
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-9 h-9 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl shadow-sm">
                            {globalIndex}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-2">
                            <span className="inline-flex items-center gap-2 text-xs font-mono font-bold px-3 py-1.5 rounded-xl shadow-md w-fit"
                              style={{ 
                                backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}15`,
                                color: TENANT_CONFIG.PRIMARY_COLOR 
                              }}>
                              <FileText className="w-3.5 h-3.5" />
                              {participante.codigo}
                            </span>
                            {participante.tiene_override && (
                              <span className="inline-flex items-center gap-1.5 text-xs text-purple-600 font-bold w-fit">
                                <Star className="w-3.5 h-3.5 fill-purple-600" />
                                Personalizado
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {isEditingCert ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={nombreEditado}
                                onChange={(e) => setNombreEditado(e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 text-sm font-medium"
                                placeholder="Nombre completo..."
                                disabled={regenerando === participante.certificado_id}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => guardarYRegenerar(participante.certificado_id)}
                                  disabled={regenerando === participante.certificado_id}
                                  className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl hover:opacity-90 transition-all text-sm font-semibold disabled:opacity-50 shadow-lg"
                                  style={{ background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})` }}
                                >
                                  {regenerando === participante.certificado_id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Regenerando...
                                    </>
                                  ) : (
                                    <>
                                      <Save className="w-4 h-4" />
                                      Guardar
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={cancelarEdicionCertificado}
                                  disabled={regenerando === participante.certificado_id}
                                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-semibold flex items-center disabled:opacity-50 shadow-md"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-bold text-gray-900 mb-1">
                                  {participante.nombre_actual || participante.nombre_completo}
                                </p>
                                <p className="text-xs text-gray-500 font-medium">
                                  DNI: {participante.numero_documento}
                                </p>
                              </div>
                              <button
                                onClick={() => iniciarEdicionCertificado(participante)}
                                className="flex items-center gap-1.5 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-all text-sm font-semibold shadow-sm"
                              >
                                <Edit2 className="w-4 h-4" />
                                Editar
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {participante.estado === 'activo' ? (
                            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold bg-green-50 text-green-700 border-2 border-green-200 shadow-sm">
                              <CheckCircle2 className="w-4 h-4" />
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold bg-red-50 text-red-700 border-2 border-red-200 shadow-sm">
                              <XCircle className="w-4 h-4" />
                              Revocado
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => previewCertificate(participante.codigo)}
                              className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm hover:shadow-md"
                              title="Vista previa"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => downloadCertificate(participante.codigo)}
                              className="p-2.5 text-green-600 hover:bg-green-50 rounded-xl transition-all shadow-sm hover:shadow-md"
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
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  No se encontraron certificados
                </h3>
                <p className="text-sm text-gray-500 font-medium">
                  {searchTerm
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Este lote no tiene certificados registrados'}
                </p>
              </div>
            )}
          </div>

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="mt-6 bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 font-semibold">
                  Mostrando {startIndex + 1} - {Math.min(endIndex, filteredParticipantes.length)} de {filteredParticipantes.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-1.5">
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
                          className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all shadow-sm ${
                            currentPage === pageNum
                              ? 'text-white shadow-lg scale-110'
                              : 'text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50'
                          }`}
                          style={currentPage === pageNum ? {
                            background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                          } : {}}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CONSEJOS */}
          <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-bold mb-2 text-base">💡 Consejos útiles:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700 font-medium">
                  <li>Haz clic en <strong>Editar</strong> para modificar el nombre que aparece en el certificado</li>
                  <li>Los cambios se guardan automáticamente y el PDF se regenera al instante</li>
                  <li>Los certificados personalizados muestran un icono de <strong>estrella morada</strong></li>
                  <li>Usa <strong>Vista previa</strong> para verificar el certificado antes de descargarlo</li>
                  <li>Puedes filtrar por estado (activo/revocado) y buscar por nombre, DNI o código</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}