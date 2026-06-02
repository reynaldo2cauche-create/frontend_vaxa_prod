'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantConfig } from '@/lib/tenants';
import {
  Building2, FileText, TrendingUp, CreditCard, Plus, ArrowRight, Loader2,
} from '@/components/ui/icon';
import HeaderSistemasVaxa from '../../shared/components/HeaderSistemasVaxa';
import { VAXA_CONFIG } from '../../shared/constants';
import { authStorage } from '@/lib/auth';
import { ApiError } from '@/lib/api/client';
import { creditosAdminApi, type EmpresaCreditos } from '../../shared/api/creditos.admin.api';

interface Props { tenantId: string; tenant: TenantConfig; }
interface Usuario { email: string; nombre: string; role: string; }

export default function DashboardCertificaciones({ tenantId }: Props) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresas, setEmpresas] = useState<EmpresaCreditos[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setEmpresas(await creditosAdminApi.listEmpresas());
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        authStorage.clearAllSessions();
        navigate(`/${tenantId}/login`);
      }
    } finally {
      setLoading(false);
    }
  }, [tenantId, navigate]);

  useEffect(() => {
    if (localStorage.getItem(`auth_${tenantId}`) !== 'true' || !authStorage.getToken('vaxa')) {
      navigate(`/${tenantId}/login`);
      return;
    }
    try { setUsuario(JSON.parse(localStorage.getItem(`auth_user_${tenantId}`) ?? 'null')); } catch { /* noop */ }
    fetchData();
  }, [tenantId, navigate, fetchData]);

  if (!usuario) return null;

  const totalEmpresas = empresas.length;
  const activas = empresas.filter((e) => e.activo).length;
  const creditosDisponibles = empresas.reduce((a, e) => a + e.creditos_disponibles, 0);
  const consumidos = empresas.reduce((a, e) => a + e.creditos_consumidos, 0);

  const stats = [
    { title: 'Empresas Registradas', value: totalEmpresas, icon: Building2, bg: 'bg-emerald-50', tc: 'text-emerald-600' },
    { title: 'Empresas Activas', value: activas, icon: TrendingUp, bg: 'bg-blue-50', tc: 'text-blue-600' },
    { title: 'Créditos Disponibles', value: creditosDisponibles, icon: CreditCard, bg: 'bg-purple-50', tc: 'text-purple-600' },
    { title: 'Certificados Emitidos', value: consumidos, icon: FileText, bg: 'bg-orange-50', tc: 'text-orange-600' },
  ];

  const recientes = empresas.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSistemasVaxa
        tenantId={tenantId}
        usuario={usuario}
        config={{ name: 'Sistema de Certificaciones', primaryColor: VAXA_CONFIG.PRIMARY_COLOR, secondaryColor: VAXA_CONFIG.SECONDARY_COLOR }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Certificaciones</h1>
            <p className="text-gray-600">Gestiona empresas, usuarios y créditos</p>
          </div>
          <button
            onClick={() => navigate(`/${tenantId}/certificaciones/registrar-empresa`)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus className="w-5 h-5" /> Registrar Empresa
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400"><Loader2 className="w-7 h-7 animate-spin" /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${s.tc}`} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{s.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <button onClick={() => navigate(`/${tenantId}/certificaciones/empresas`)}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-300 transition-all text-left group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ver Todas las Empresas</h3>
                <p className="text-sm text-gray-600">Empresas, créditos y usuarios</p>
              </button>

              <button onClick={() => navigate(`/${tenantId}/certificaciones/registrar-empresa`)}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all text-left group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Registrar Nueva Empresa</h3>
                <p className="text-sm text-gray-600">Agrega una empresa al sistema</p>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Empresas Recientes</h2>
                <button onClick={() => navigate(`/${tenantId}/certificaciones/empresas`)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                  Ver todas <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {recientes.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">Aún no hay empresas registradas.</p>
              ) : (
                <div className="space-y-4">
                  {recientes.map((e) => (
                    <div key={e.id} onClick={() => navigate(`/${tenantId}/certificaciones/empresa/${e.id}`)}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                          <Building2 className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{e.razon_social}</h3>
                          <p className="text-sm text-gray-500">{e.tenant_slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Créditos</p>
                          <p className="font-semibold text-gray-900">{e.creditos_disponibles}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
