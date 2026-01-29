'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TenantConfig } from '@/lib/tenants';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Loader2,
  FolderOpen,
  Sparkles,
  Package,
  ArrowLeft
} from 'lucide-react';
import { TENANT_CONFIG } from '../../shared/constants';
import { Header } from '../../shared/components';

interface HistorialLotesProps {
  tenantId: string;
  tenant: TenantConfig;
}

interface Usuario {
  email: string;
  nombre: string;
  role: string;
}

interface Lote {
  id: number;
  nombreArchivo: string;
  cantidadCertificados: number;
  fechaProcesado: string;
  totalCertificados: number;
  tieneZip: boolean;
}

// Datos estáticos de ejemplo
const LOTES_ESTATICOS: Lote[] = [
  {
    id: 1,
    nombreArchivo: 'Capacitacion_Seguridad_Industrial_2024.xlsx',
    cantidadCertificados: 45,
    fechaProcesado: '2024-01-15T10:30:00',
    totalCertificados: 45,
    tieneZip: true
  },
  {
    id: 2,
    nombreArchivo: 'Curso_Liderazgo_Empresarial_Enero.xlsx',
    cantidadCertificados: 32,
    fechaProcesado: '2024-01-10T14:20:00',
    totalCertificados: 32,
    tieneZip: true
  },
  {
    id: 3,
    nombreArchivo: 'Taller_Innovacion_Digital.xlsx',
    cantidadCertificados: 28,
    fechaProcesado: '2024-01-05T09:15:00',
    totalCertificados: 28,
    tieneZip: true
  },
  {
    id: 4,
    nombreArchivo: 'Seminario_Gestion_Proyectos.xlsx',
    cantidadCertificados: 56,
    fechaProcesado: '2023-12-20T16:45:00',
    totalCertificados: 56,
    tieneZip: true
  }
];

export default function HistorialLotes({ tenantId, tenant }: HistorialLotesProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [descargandoZip, setDescargandoZip] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const lotesPerPage = 10;

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

    // Cargar lotes estáticos
    setLotes(LOTES_ESTATICOS);
    setLoading(false);
  }, [tenantId, router]);

  const descargarZip = async (loteId: number) => {
    try {
      setDescargandoZip(loteId);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(`Descargando ZIP del lote ${loteId}`);
      alert(`Descargando ZIP del lote ${loteId}`);
    } catch (error) {
      console.error('Error al descargar ZIP:', error);
      alert('Error al descargar el archivo ZIP');
    } finally {
      setDescargandoZip(null);
    }
  };

  const verCertificados = (loteId: number) => {
    router.push(`/${tenantId}/historial/${loteId}/certificados`);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && lotes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando lotes...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  const totalPages = Math.ceil(lotes.length / lotesPerPage);
  const startIndex = (page - 1) * lotesPerPage;
  const lotesPaginados = lotes.slice(startIndex, startIndex + lotesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* HEADER NAVBAR */}
      <Header tenantId={tenantId} usuario={usuario} />

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/${tenantId}`)}
            className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 mb-6 px-4 py-2 rounded-lg transition-all font-medium hover:text-gray-900 animate-[fadeIn_0.5s_ease-out]"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>

          <div className="flex items-center justify-between animate-[slideUp_0.6s_ease-out_0.1s_both]">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                }}
              >
                <FolderOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Historial de Lotes</h1>
                <p className="text-sm text-gray-600 font-medium">
                  Gestiona y descarga todos tus lotes de certificados
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-100">
              <Sparkles className="w-5 h-5" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">Total de lotes</p>
                <p className="text-2xl font-bold text-gray-900">{lotes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Lotes */}
        {lotes.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}15` }}
            >
              <Package className="w-12 h-12" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No hay lotes generados aún
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Comienza generando tu primer lote de certificados desde el dashboard principal
            </p>
            <button
              onClick={() => router.push(`/${tenantId}`)}
              className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-xl hover:shadow-xl transition-all font-semibold transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
              }}
            >
              <Sparkles className="w-5 h-5" />
              Ir al Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {lotesPaginados.map((lote, index) => (
              <div
                key={lote.id}
                className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative overflow-hidden"
                style={{
                  animation: `slideUp 0.5s ease-out ${0.2 + index * 0.1}s both`
                }}
              >
                {/* Decoración de fondo */}
                <div
                  className="absolute top-0 right-0 w-64 h-64 opacity-5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                  }}
                ></div>

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Info del Lote - Columna Izquierda */}
                  <div className="lg:col-span-7">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}15` }}
                      >
                        <FileText className="w-7 h-7" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                          {lote.nombreArchivo}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{formatearFecha(lote.fechaProcesado)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas - Columna Central */}
                  <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-gray-50 rounded-2xl p-4 text-center">
                        <p className="text-xs text-gray-500 font-semibold mb-1">Total</p>
                        <p className="text-2xl font-bold text-gray-900">{lote.totalCertificados}</p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones - Columna Derecha */}
                  <div className="lg:col-span-2 flex flex-col gap-3">
                    <button
                      onClick={() => verCertificados(lote.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                      style={{
                        background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden xl:inline">Ver Detalles</span>
                    </button>
                    <button
                      onClick={() => descargarZip(lote.id)}
                      disabled={descargandoZip === lote.id}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {descargandoZip === lote.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="hidden xl:inline">Generando...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span className="hidden xl:inline">Descargar ZIP</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
            >
              Anterior
            </button>
            <span
              className="px-6 py-2 text-white rounded-xl font-bold"
              style={{
                background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
              }}
            >
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
