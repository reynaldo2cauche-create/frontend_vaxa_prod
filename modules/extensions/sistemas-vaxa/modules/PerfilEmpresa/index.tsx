'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantConfig } from '@/lib/tenants';
import {
  ArrowLeft, Building2, Users, CreditCard, Info, Loader2, AlertCircle,
} from '@/components/ui/icon';
import HeaderSistemasVaxa from '../../shared/components/HeaderSistemasVaxa';
import { VAXA_CONFIG } from '../../shared/constants';
import { authStorage } from '@/lib/auth';
import { ApiError } from '@/lib/api/client';
import { creditosAdminApi, type EmpresaCreditos } from '../../shared/api/creditos.admin.api';
import TabInformacion from './TabInformacion';
import TabPlan from './TabPlan';
import TabUsuarios from './TabUsuarios';

interface PerfilEmpresaProps { tenantId: string; tenant: TenantConfig; empresaId: string; }
interface Usuario { email: string; nombre: string; role: string; }
type TabType = 'informacion' | 'plan' | 'usuarios';

export default function PerfilEmpresa({ tenantId, empresaId }: PerfilEmpresaProps) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresa, setEmpresa] = useState<EmpresaCreditos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('informacion');

  const cargar = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const lista = await creditosAdminApi.listEmpresas();
      setEmpresa(lista.find((e) => e.id === Number(empresaId)) ?? null);
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        authStorage.clearAllSessions();
        navigate(`/${tenantId}/login`);
        return;
      }
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [empresaId, tenantId, navigate]);

  useEffect(() => {
    if (localStorage.getItem(`auth_${tenantId}`) !== 'true' || !authStorage.getToken('vaxa')) {
      navigate(`/${tenantId}/login`);
      return;
    }
    try { setUsuario(JSON.parse(localStorage.getItem(`auth_user_${tenantId}`) ?? 'null')); } catch { /* noop */ }
    cargar();
  }, [tenantId, navigate, cargar]);

  if (!usuario) return null;

  const tabs = [
    { id: 'informacion' as TabType, label: 'Información', icon: Info },
    { id: 'plan' as TabType, label: 'Créditos', icon: CreditCard },
    { id: 'usuarios' as TabType, label: 'Usuarios', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSistemasVaxa
        tenantId={tenantId}
        usuario={usuario}
        config={{ name: 'Sistema de Certificaciones', primaryColor: VAXA_CONFIG.PRIMARY_COLOR, secondaryColor: VAXA_CONFIG.SECONDARY_COLOR }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/${tenantId}/certificaciones/empresas`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver a Empresas</span>
        </button>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400"><Loader2 className="w-7 h-7 animate-spin" /></div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" /> <p className="text-sm text-red-800">{error}</p>
          </div>
        ) : !empresa ? (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Empresa no encontrada</h2>
            <button onClick={() => navigate(`/${tenantId}/certificaciones/empresas`)}
              className="mt-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold">Volver a Empresas</button>
          </div>
        ) : (
          <>
            {/* Header empresa */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-gray-200">
                  <Building2 className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{empresa.razon_social}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{empresa.tenant_slug}</span>
                    {empresa.ruc && <span>RUC {empresa.ruc}</span>}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${empresa.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {empresa.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Créditos disponibles</p>
                  <p className="text-2xl font-bold text-emerald-600">{empresa.creditos_disponibles}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Consumidos</p>
                  <p className="text-2xl font-bold text-gray-900">{empresa.creditos_consumidos}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Asignados (total)</p>
                  <p className="text-2xl font-bold text-gray-900">{empresa.creditos_asignados_total}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                          activeTab === tab.id ? 'border-emerald-600 text-emerald-600 bg-emerald-50' : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}>
                        <Icon className="w-5 h-5" /> {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="p-6">
                {activeTab === 'informacion' && <TabInformacion empresa={empresa} onChange={cargar} />}
                {activeTab === 'plan' && <TabPlan empresa={empresa} onChange={cargar} />}
                {activeTab === 'usuarios' && <TabUsuarios empresa={empresa} />}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
