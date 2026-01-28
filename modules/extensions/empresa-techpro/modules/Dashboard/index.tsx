'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TenantConfig } from '@/lib/tenants';
import {
  FileText,
  Calendar,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { TENANT_CONFIG } from '../../shared/constants';
import { Header } from '../../shared/components';
import GeneradorCertificados from './GeneradorCertificados';

interface DashboardProps {
  tenantId: string;
  tenant: TenantConfig;
}

interface Usuario {
  email: string;
  nombre: string;
  role: string;
}

interface DashboardStats {
  total_certificados: number;
  certificados_mes: number;
  ultimo_lote: string | null;
}

export default function TechProDashboard({
  tenantId,
  tenant,
}: DashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    total_certificados: 1247,
    certificados_mes: 89,
    ultimo_lote: 'Hace 2 días'
  });

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <Header tenantId={tenantId} usuario={usuario} />

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header con bienvenida */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hola, {usuario.nombre.split(' ')[0]} 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Aquí tienes un resumen de tu actividad
          </p>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1 - Total Certificados */}
          <div className="bg-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
            <div className="flex items-center justify-between mb-5">
              <div
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}15` }}
              >
                <div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-30"
                  style={{ backgroundColor: TENANT_CONFIG.PRIMARY_COLOR }}
                />
                <FileText className="w-8 h-8 relative" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Total
              </span>
            </div>
            <p
              className="text-5xl font-bold mb-2"
              style={{ color: TENANT_CONFIG.PRIMARY_COLOR }}
            >
              {stats.total_certificados.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 font-medium">Certificados emitidos</p>
          </div>

          {/* Card 2 - Este Mes */}
          <div className="bg-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
            <div className="flex items-center justify-between mb-5">
              <div
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}15` }}
              >
                <div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-30"
                  style={{ backgroundColor: TENANT_CONFIG.PRIMARY_COLOR }}
                />
                <Calendar className="w-8 h-8 relative" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Mes
              </span>
            </div>
            <p
              className="text-5xl font-bold mb-2"
              style={{ color: TENANT_CONFIG.PRIMARY_COLOR }}
            >
              {stats.certificados_mes.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 font-medium">Nuevos este mes</p>
          </div>

          {/* Card 3 - Actividad */}
          <div className="bg-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2">
            <div className="flex items-center justify-between mb-5">
              <div
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}15` }}
              >
                <div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-30"
                  style={{ backgroundColor: TENANT_CONFIG.PRIMARY_COLOR }}
                />
                <TrendingUp className="w-8 h-8 relative" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }} />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Último
              </span>
            </div>
            <p
              className="text-2xl font-bold mb-2 truncate"
              style={{ color: TENANT_CONFIG.PRIMARY_COLOR }}
            >
              {stats.ultimo_lote || 'Sin actividad'}
            </p>
            <p className="text-sm text-gray-500 font-medium">Lote generado</p>
          </div>
        </div>

        {/* Sección de actividad reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-lg hover:shadow-xl transition-all">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all shadow-sm hover:shadow-md">
                <div className="w-2.5 h-2.5 rounded-full mt-2 shadow-lg" style={{ backgroundColor: TENANT_CONFIG.PRIMARY_COLOR }}></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Sistema iniciado</p>
                  <p className="text-xs text-gray-500 mt-1">Hace unos momentos</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all shadow-sm hover:shadow-md">
                <div className="w-2.5 h-2.5 rounded-full mt-2 shadow-lg" style={{ backgroundColor: TENANT_CONFIG.PRIMARY_COLOR }}></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Dashboard personalizado cargado</p>
                  <p className="text-xs text-gray-500 mt-1">Vista exclusiva de {TENANT_CONFIG.NAME}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-lg hover:shadow-xl transition-all">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Estado del Sistema
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all shadow-sm hover:shadow-md">
                <span className="text-sm font-semibold text-gray-900">Sistema Operativo</span>
                <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">Activo</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all shadow-sm hover:shadow-md">
                <span className="text-sm font-semibold text-gray-900">Autenticación</span>
                <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">Conectado</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all shadow-sm hover:shadow-md">
                <span className="text-sm font-semibold text-gray-900">Módulo Dashboard</span>
                <span className="px-3 py-1.5 text-white text-xs font-semibold rounded-full shadow-lg" style={{ backgroundColor: TENANT_CONFIG.PRIMARY_COLOR }}>Personalizado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generador de Certificados */}
        <GeneradorCertificados />

        {/* Información del tenant */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 mt-10 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-7">Información del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Nombre de la Empresa</p>
              <p className="text-base font-bold text-gray-900">{TENANT_CONFIG.NAME}</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Tenant ID</p>
              <p className="text-base font-bold text-gray-900 font-mono">{tenantId}</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Usuario Activo</p>
              <p className="text-base font-bold text-gray-900">{usuario.nombre}</p>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Rol</p>
              <p className="text-base font-bold text-gray-900 capitalize">{usuario.role}</p>
            </div>
          </div>
          <div
            className="mt-6 p-5 rounded-2xl shadow-inner"
            style={{ backgroundColor: `${TENANT_CONFIG.PRIMARY_COLOR}10` }}
          >
            <p className="text-sm text-gray-700">
              <strong>Nota:</strong> Dashboard personalizado para {TENANT_CONFIG.NAME}, ubicado en{' '}
              <code className="bg-white px-2 py-1 rounded-lg text-xs font-mono text-gray-800 shadow-sm">/modules/extensions/empresa-techpro/modules/Dashboard</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-sm text-gray-400">
          <p>Powered by <strong className="text-gray-600">VAXA</strong> - Sistema de Gestión Empresarial</p>
        </div>
      </main>
    </div>
  );
}
