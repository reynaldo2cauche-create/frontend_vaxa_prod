'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TenantConfig } from '@/lib/tenants';
import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import Header from '@/components/shared/Header';
import { VAXA_CONFIG } from '../../shared/constants';
import { SISTEMAS_MOCK, USUARIOS_MOCK } from '../../shared/data/mockData';

interface DashboardProps {
  tenantId: string;
  tenant: TenantConfig;
}

interface Usuario {
  email: string;
  nombre: string;
  role: string;
}

export default function VaxaDashboard({ tenantId, tenant }: DashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
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
        router.push(`/${tenantId}/login`);
        return;
      }
    }

    setLoading(false);
  }, [tenantId, router]);

  if (loading || !usuario) {
    return null;
  }

  const sistemasActivos = SISTEMAS_MOCK.filter(s => s.estado === 'activo').length;
  const totalUsuarios = USUARIOS_MOCK.length;
  const totalCertificados = SISTEMAS_MOCK.reduce((acc, s) => acc + (s.certificadosGenerados || 0), 0);

  const stats = [
    { title: 'Sistemas Activos', value: sistemasActivos, icon: Package, color: 'indigo' },
    { title: 'Total Usuarios', value: totalUsuarios, icon: Users, color: 'green' },
    { title: 'Certificados', value: totalCertificados, icon: BarChart3, color: 'purple' },
    { title: 'Sistemas Totales', value: SISTEMAS_MOCK.length, icon: LayoutDashboard, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        tenantId={tenantId}
        usuario={usuario}
        config={{
          name: VAXA_CONFIG.NAME,
          primaryColor: VAXA_CONFIG.PRIMARY_COLOR,
          secondaryColor: VAXA_CONFIG.SECONDARY_COLOR,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona todos los sistemas de Vaxa</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                  <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => router.push(`/${tenantId}/sistemas`)}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Gestionar Sistemas</h3>
            <p className="text-sm text-gray-600">Ver y administrar todos los sistemas</p>
          </button>

          <button
            onClick={() => router.push(`/${tenantId}/usuarios`)}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Gestionar Usuarios</h3>
            <p className="text-sm text-gray-600">Administrar usuarios de los sistemas</p>
          </button>

          <button
            onClick={() => router.push(`/${tenantId}/configuracion`)}
            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Configuración</h3>
            <p className="text-sm text-gray-600">Logos, firmas y personalización</p>
          </button>
        </div>
      </main>
    </div>
  );
}
