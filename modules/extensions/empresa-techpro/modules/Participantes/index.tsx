'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TenantConfig } from '@/lib/tenants';
import {
  Search,
  User,
  FileText,
  Calendar,
  Download,
  Eye,
  Loader2,
  Edit2,
  Save,
  X,
  RefreshCw,
  Package,
  Users,
  AlertCircle,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import { TENANT_CONFIG } from '../../shared/constants';
import { Header } from '../../shared/components';

interface ParticipantesProps {
  tenantId: string;
  tenant: TenantConfig;
}

interface Usuario {
  email: string;
  nombre: string;
  role: string;
}

interface Certificado {
  id: number;
  codigo_unico: string;
  nombre_actual: string;
  tiene_override: boolean;
  fecha_emision: string;
  lote_id: number;
  tipo_documento: string;
  curso: string;
}

interface Participante {
  id: number;
  dni: string;
  nombre: string;
  email: string;
  telefono: string;
  certificados: Certificado[];
}

// Datos estáticos de ejemplo
const PARTICIPANTES_ESTATICOS: Participante[] = [
  {
    id: 1,
    dni: '45678901',
    nombre: 'Juan Carlos Pérez García',
    email: 'juan.perez@email.com',
    telefono: '987654321',
    certificados: [
      {
        id: 101,
        codigo_unico: 'CERT-1-0001',
        nombre_actual: 'Juan Carlos Pérez García',
        tiene_override: false,
        fecha_emision: '2024-01-15T10:30:00',
        lote_id: 1,
        tipo_documento: 'Certificado',
        curso: 'Capacitación en Seguridad Industrial'
      },
      {
        id: 102,
        codigo_unico: 'CERT-2-0005',
        nombre_actual: 'Juan Carlos Pérez García',
        tiene_override: false,
        fecha_emision: '2024-01-10T14:20:00',
        lote_id: 2,
        tipo_documento: 'Certificado',
        curso: 'Curso de Liderazgo Empresarial'
      }
    ]
  },
  {
    id: 2,
    dni: '45678902',
    nombre: 'María Elena Rodríguez López',
    email: 'maria.rodriguez@email.com',
    telefono: '987654322',
    certificados: [
      {
        id: 201,
        codigo_unico: 'CERT-1-0002',
        nombre_actual: 'María Elena Rodríguez López',
        tiene_override: false,
        fecha_emision: '2024-01-15T10:30:00',
        lote_id: 1,
        tipo_documento: 'Certificado',
        curso: 'Capacitación en Seguridad Industrial'
      }
    ]
  }
];

export default function Participantes({ tenantId, tenant }: ParticipantesProps) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [noEncontrado, setNoEncontrado] = useState(false);

  // Estados para edición de certificados
  const [editandoCertificado, setEditandoCertificado] = useState<number | null>(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const [regenerando, setRegenerando] = useState<number | null>(null);

  // Estados para edición de participante
  const [editandoParticipante, setEditandoParticipante] = useState<number | null>(null);
  const [participanteEditado, setParticipanteEditado] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    dni: ''
  });
  const [guardandoParticipante, setGuardandoParticipante] = useState(false);

  // Estado para expandir/contraer certificados
  const [certificadosExpandidos, setCertificadosExpandidos] = useState<Record<number, boolean>>({});

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

    setLoading(false);
  }, [tenantId, router]);

  const buscarParticipante = async () => {
    if (!terminoBusqueda.trim()) {
      alert('Por favor ingresa un DNI o nombre para buscar');
      return;
    }

    setBuscando(true);
    setNoEncontrado(false);
    setParticipantes([]);

    // Simular búsqueda
    await new Promise((resolve) => setTimeout(resolve, 800));

    const resultados = PARTICIPANTES_ESTATICOS.filter(
      (p) =>
        p.dni.includes(terminoBusqueda) ||
        p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );

    if (resultados.length === 0) {
      setNoEncontrado(true);
    } else {
      setParticipantes(resultados);
    }

    setBuscando(false);
  };

  const iniciarEdicion = (certificado: Certificado) => {
    setEditandoCertificado(certificado.id);
    setNombreEditado(certificado.nombre_actual);
  };

  const cancelarEdicion = () => {
    setEditandoCertificado(null);
    setNombreEditado('');
  };

  const iniciarEdicionParticipante = (participante: Participante) => {
    setEditandoParticipante(participante.id);
    const nombreCompleto = participante.nombre.split(' ');
    const apellidos = nombreCompleto.slice(-2).join(' ');
    const nombres = nombreCompleto.slice(0, -2).join(' ') || nombreCompleto[0];

    setParticipanteEditado({
      nombres: nombres,
      apellidos: apellidos,
      email: participante.email || '',
      telefono: participante.telefono || '',
      dni: participante.dni
    });
  };

  const cancelarEdicionParticipante = () => {
    setEditandoParticipante(null);
    setParticipanteEditado({
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      dni: ''
    });
  };

  const guardarParticipante = async (participanteId: number) => {
    if (!participanteEditado.nombres.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    setGuardandoParticipante(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setParticipantes((prevParticipantes) =>
        prevParticipantes.map((p) =>
          p.id === participanteId
            ? {
                ...p,
                nombre: `${participanteEditado.nombres} ${participanteEditado.apellidos}`.trim(),
                email: participanteEditado.email,
                telefono: participanteEditado.telefono
              }
            : p
        )
      );

      setEditandoParticipante(null);
      alert('Participante actualizado correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar los datos');
    } finally {
      setGuardandoParticipante(false);
    }
  };

  const guardarYRegenerar = async (certificadoId: number) => {
    if (!nombreEditado.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    setRegenerando(certificadoId);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setParticipantes((prevParticipantes) =>
        prevParticipantes.map((p) => ({
          ...p,
          certificados: p.certificados.map((cert) =>
            cert.id === certificadoId
              ? {
                  ...cert,
                  nombre_actual: nombreEditado,
                  tiene_override: true
                }
              : cert
          )
        }))
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarParticipante();
    }
  };

  const toggleCertificados = (participanteId: number) => {
    setCertificadosExpandidos((prev) => ({
      ...prev,
      [participanteId]: !prev[participanteId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* HEADER NAVBAR */}
      <Header tenantId={tenantId} usuario={usuario} />

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con título */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/${tenantId}`)}
            className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 mb-6 px-4 py-2 rounded-lg transition-all font-medium hover:text-gray-900 animate-[fadeIn_0.5s_ease-out]"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Buscar Participantes</h1>
              <p className="text-sm text-gray-600 font-medium">
                Encuentra y gestiona la información de tus participantes
              </p>
            </div>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8 animate-[slideUp_0.6s_ease-out_0.2s_both]">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
              style={{
                backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}15`
              }}
            >
              <Search className="w-6 h-6" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Buscar Participante</h3>
              <p className="text-sm text-gray-600">Ingresa DNI o nombre completo</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Buscar por DNI o nombre completo..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none transition-all text-base shadow-sm"
                style={{
                  borderColor: terminoBusqueda ? TENANT_CONFIG.PRIMARY_COLOR : undefined
                }}
              />
            </div>
            <button
              onClick={buscarParticipante}
              disabled={buscando}
              className="px-8 py-4 text-white rounded-2xl font-bold shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
              style={{
                background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
              }}
            >
              {buscando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Buscar
                </>
              )}
            </button>
          </div>
        </div>

        {/* NO ENCONTRADO */}
        {noEncontrado && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-3xl p-10 text-center shadow-xl animate-[scaleIn_0.5s_ease-out]">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}20`
              }}
            >
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Participante no encontrado</h3>
            <p className="text-gray-700 text-base mb-1">
              No se encontró ningún participante con:{' '}
              <strong className="text-gray-900">{terminoBusqueda}</strong>
            </p>
            <p className="text-sm text-gray-600 mt-2">Verifica que el DNI o nombre sean correctos</p>
          </div>
        )}

        {/* RESULTADOS */}
        {participantes.length > 0 && (
          <div className="space-y-8">
            {/* Badge de resultados */}
            <div
              className="rounded-2xl p-5 border-2 shadow-md"
              style={{
                backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}10`,
                borderColor: `${TENANT_CONFIG.PRIMARY_COLOR}40`
              }}
            >
              <p className="font-bold text-gray-800 flex items-center gap-3 text-lg">
                <Users className="w-6 h-6" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
                Se {participantes.length === 1 ? 'encontró' : 'encontraron'}{' '}
                <span style={{ color: TENANT_CONFIG.PRIMARY_COLOR }}>{participantes.length}</span> participante
                {participantes.length !== 1 ? 's' : ''}
              </p>
            </div>

            {participantes.map((participante, pIndex) => {
              const mostrarTodos = certificadosExpandidos[participante.id];
              const certificadosMostrar = mostrarTodos
                ? participante.certificados
                : participante.certificados.slice(0, 2);
              const tieneMas = participante.certificados.length > 2;

              return (
                <div
                  key={participante.id}
                  className="bg-white rounded-3xl shadow-xl border-2 p-8 hover:shadow-2xl transition-all"
                  style={{
                    borderColor: `${TENANT_CONFIG.PRIMARY_COLOR}30`,
                    animation: `slideUp 0.5s ease-out ${0.3 + pIndex * 0.1}s both`
                  }}
                >
                  {/* INFO DEL PARTICIPANTE */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                          }}
                        >
                          <User className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Información del Participante</h3>
                          <p className="text-sm text-gray-600 font-medium">DNI: {participante.dni}</p>
                        </div>
                      </div>
                    {editandoParticipante === participante.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => guardarParticipante(participante.id)}
                          disabled={guardandoParticipante}
                          className="flex items-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                        >
                          {guardandoParticipante ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              Guardar
                            </>
                          )}
                        </button>
                        <button
                          onClick={cancelarEdicionParticipante}
                          disabled={guardandoParticipante}
                          className="flex items-center gap-2 px-5 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-bold"
                        >
                          <X className="w-5 h-5" />
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => iniciarEdicionParticipante(participante)}
                        className="flex items-center gap-2 px-5 py-3 text-white rounded-xl transition-all shadow-lg font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                        }}
                      >
                        <Edit2 className="w-5 h-5" />
                        Editar Datos
                      </button>
                      )}
                    </div>

                    {editandoParticipante === participante.id ? (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nombres *</label>
                            <input
                              type="text"
                              value={participanteEditado.nombres}
                              onChange={(e) =>
                                setParticipanteEditado({ ...participanteEditado, nombres: e.target.value })
                              }
                              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all shadow-sm"
                              style={{
                                borderColor: TENANT_CONFIG.PRIMARY_COLOR
                              }}
                              placeholder="Nombres"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Apellidos *</label>
                            <input
                              type="text"
                              value={participanteEditado.apellidos}
                              onChange={(e) =>
                                setParticipanteEditado({ ...participanteEditado, apellidos: e.target.value })
                              }
                              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all shadow-sm"
                              style={{
                                borderColor: TENANT_CONFIG.PRIMARY_COLOR
                              }}
                              placeholder="Apellidos"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              DNI (no editable)
                            </label>
                            <input
                              type="text"
                              value={participanteEditado.dni}
                              disabled
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <input
                              type="email"
                              value={participanteEditado.email}
                              onChange={(e) =>
                                setParticipanteEditado({ ...participanteEditado, email: e.target.value })
                              }
                              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all shadow-sm"
                              style={{
                                borderColor: TENANT_CONFIG.PRIMARY_COLOR
                              }}
                              placeholder="correo@ejemplo.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono</label>
                            <input
                              type="tel"
                              value={participanteEditado.telefono}
                              onChange={(e) =>
                                setParticipanteEditado({ ...participanteEditado, telefono: e.target.value })
                              }
                              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all shadow-sm"
                              style={{
                                borderColor: TENANT_CONFIG.PRIMARY_COLOR
                              }}
                              placeholder="999 999 999"
                            />
                          </div>
                        </div>
                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 shadow-sm">
                          <p className="text-sm text-yellow-800 flex items-center gap-2 font-medium">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>
                              <strong>Importante:</strong> Los cambios solo afectan los datos del participante. Los
                              certificados ya generados mantendrán el nombre original.
                            </span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200 shadow-sm">
                          <p className="text-sm font-bold text-gray-600 mb-2">Nombre Completo</p>
                          <p className="text-lg font-bold text-gray-900">{participante.nombre}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200 shadow-sm">
                          <p className="text-sm font-bold text-gray-600 mb-2">DNI</p>
                          <p className="text-lg font-bold text-gray-900">{participante.dni}</p>
                        </div>
                        {participante.email && (
                          <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200 shadow-sm">
                            <p className="text-sm font-bold text-gray-600 mb-2">Email</p>
                            <p className="text-lg font-bold text-gray-900">{participante.email}</p>
                          </div>
                        )}
                        {participante.telefono && (
                          <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200 shadow-sm">
                            <p className="text-sm font-bold text-gray-600 mb-2">Teléfono</p>
                            <p className="text-lg font-bold text-gray-900">{participante.telefono}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CERTIFICADOS - Ahora integrados dentro de la misma card */}
                  <div className="mt-8 pt-8 border-t-2" style={{ borderColor: `${TENANT_CONFIG.PRIMARY_COLOR}30` }}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                          style={{
                            backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}15`
                          }}
                        >
                          <FileText className="w-6 h-6" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            Certificados ({participante.certificados.length})
                          </h3>
                          <p className="text-xs text-gray-600 font-medium">Documentos emitidos</p>
                        </div>
                      </div>
                      {tieneMas && (
                        <button
                          onClick={() => toggleCertificados(participante.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all"
                          style={{
                            color: TENANT_CONFIG.PRIMARY_COLOR,
                            backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}15`
                          }}
                        >
                          {mostrarTodos ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Mostrar menos
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Ver todos ({participante.certificados.length})
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {participante.certificados.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-bold text-base">
                          Este participante aún no tiene certificados generados
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {certificadosMostrar.map((cert) => (
                          <div
                            key={cert.id}
                            className="border rounded-2xl p-5 hover:shadow-md transition-all"
                            style={{
                              backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}05`,
                              borderColor: editandoCertificado === cert.id ? TENANT_CONFIG.PRIMARY_COLOR : `${TENANT_CONFIG.PRIMARY_COLOR}20`
                            }}
                          >
                            {/* Header del certificado */}
                            <div className="flex items-start justify-between mb-4 pb-4 border-b" style={{ borderColor: `${TENANT_CONFIG.PRIMARY_COLOR}20` }}>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-xs font-bold text-gray-600">Código:</span>
                                  <span
                                    className="text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm border"
                                    style={{
                                      color: TENANT_CONFIG.PRIMARY_COLOR,
                                      backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}15`,
                                      borderColor: `${TENANT_CONFIG.PRIMARY_COLOR}30`
                                    }}
                                  >
                                    {cert.codigo_unico}
                                  </span>
                                  {cert.tiene_override && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg font-bold border border-purple-200 flex items-center gap-1">
                                      <Star className="w-3 h-3 fill-purple-600" />
                                      Personalizado
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-3">
                                  <div className="bg-white rounded-lg p-2.5 border border-gray-200 shadow-sm">
                                    <p className="text-xs text-gray-600 mb-0.5 font-bold">Tipo</p>
                                    <p className="text-xs font-bold text-gray-900">
                                      {cert.tipo_documento || 'N/A'}
                                    </p>
                                  </div>
                                  <div className="bg-white rounded-lg p-2.5 border border-gray-200 shadow-sm">
                                    <p className="text-xs text-gray-600 mb-0.5 font-bold">Curso</p>
                                    <p className="text-xs font-bold text-gray-900">{cert.curso || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md text-xs font-bold"
                                  onClick={() => alert('Vista previa del certificado')}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Ver
                                </button>
                                <button
                                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md text-xs font-bold"
                                  onClick={() => alert('Descargando certificado')}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Descargar
                                </button>
                              </div>
                            </div>

                            {/* Edición de nombre */}
                            <div className="pt-3">
                              {editandoCertificado === cert.id ? (
                                <div className="space-y-3">
                                  <label className="block text-xs font-bold text-gray-700">
                                    Editar nombre en el certificado:
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={nombreEditado}
                                      onChange={(e) => setNombreEditado(e.target.value)}
                                      className="flex-1 px-3 py-2.5 border-2 rounded-lg focus:outline-none transition-all text-sm shadow-sm"
                                      style={{
                                        borderColor: TENANT_CONFIG.PRIMARY_COLOR
                                      }}
                                      placeholder="Nombre completo..."
                                      disabled={regenerando === cert.id}
                                    />
                                    <button
                                      onClick={() => guardarYRegenerar(cert.id)}
                                      disabled={regenerando === cert.id}
                                      className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md font-bold disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                    >
                                      {regenerando === cert.id ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          Regenerando...
                                        </>
                                      ) : (
                                        <>
                                          <RefreshCw className="w-4 h-4" />
                                          Guardar
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={cancelarEdicion}
                                      disabled={regenerando === cert.id}
                                      className="flex items-center gap-2 px-3 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-bold text-xs"
                                    >
                                      <X className="w-4 h-4" />
                                      Cancelar
                                    </button>
                                  </div>
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
                                    <p className="text-xs text-blue-800 flex items-center gap-2 font-medium">
                                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span>
                                        Al guardar se regenerará automáticamente el PDF con el nuevo nombre
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                  <div>
                                    <p className="text-xs text-gray-600 mb-1 font-bold">
                                      Nombre en el certificado:
                                    </p>
                                    <p className="text-sm font-bold text-gray-900">{cert.nombre_actual}</p>
                                  </div>
                                  <button
                                    onClick={() => iniciarEdicion(cert)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg transition-all shadow-md font-bold text-xs"
                                    style={{
                                      background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                                    }}
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Editar
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Footer con info adicional */}
                            <div className="mt-4 pt-4 border-t" style={{ borderColor: `${TENANT_CONFIG.PRIMARY_COLOR}20` }}>
                              <div className="flex items-center gap-4 text-xs text-gray-600 font-medium">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>
                                    {new Date(cert.fecha_emision).toLocaleDateString('es-PE', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <div className="flex items-center gap-1.5">
                                  <Package className="w-3.5 h-3.5" />
                                  <span>Lote #{cert.lote_id}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
