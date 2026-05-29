'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantConfig } from '@/lib/tenants';
import {
  Search, Plus, Building2, Eye, Loader2, AlertCircle,
} from '@/components/ui/icon';
import HeaderSistemasVaxa from '../../shared/components/HeaderSistemasVaxa';
import { VAXA_CONFIG } from '../../shared/constants';
import { authStorage } from '@/lib/auth';
import { ApiError } from '@/lib/api/client';
import { creditosAdminApi, type EmpresaCreditos } from '../../shared/api/creditos.admin.api';

interface Props { tenantId: string; tenant: TenantConfig; }
interface Usuario { email: string; nombre: string; role: string; }

export default function EmpresasCertificaciones({ tenantId }: Props) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresas, setEmpresas] = useState<EmpresaCreditos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmpresas = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      setEmpresas(await creditosAdminApi.listEmpresas());
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
  }, [tenantId, navigate]);

  useEffect(() => {
    if (localStorage.getItem(`auth_${tenantId}`) !== 'true' || !authStorage.getToken('vaxa')) {
      navigate(`/${tenantId}/login`);
      return;
    }
    try { setUsuario(JSON.parse(localStorage.getItem(`auth_user_${tenantId}`) ?? 'null')); } catch { /* noop */ }
    fetchEmpresas();
  }, [tenantId, navigate, fetchEmpresas]);

  if (!usuario) return null;

  const q = searchTerm.toLowerCase().trim();
  const filtradas = empresas.filter((e) =>
    e.razon_social.toLowerCase().includes(q) ||
    e.tenant_slug.toLowerCase().includes(q) ||
    (e.ruc ?? '').toLowerCase().includes(q),
  );

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Empresas Registradas</h1>
            <p className="text-gray-600">Gestiona las empresas que usan el sistema de certificados</p>
          </div>
          <button
            onClick={() => navigate(`/${tenantId}/certificaciones/registrar-empresa`)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus className="w-5 h-5" /> Registrar Empresa
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text" placeholder="Buscar por nombre, slug o RUC..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" /> <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20 text-gray-400"><Loader2 className="w-7 h-7 animate-spin" /></div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Empresa</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Créditos</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Consumidos</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Estado</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtradas.map((e) => {
                    const bajo = e.creditos_disponibles <= 0, medio = e.creditos_disponibles > 0 && e.creditos_disponibles <= 10;
                    return (
                      <tr key={e.id} className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/${tenantId}/certificaciones/empresa/${e.id}`)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                              <Building2 className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{e.razon_social}</p>
                              <p className="text-sm text-gray-500">{e.tenant_slug}{e.ruc ? ` · ${e.ruc}` : ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 rounded-full text-sm font-bold"
                            style={{ background: bajo ? '#FEF2F2' : medio ? '#FFFBEB' : '#F0FDF4', color: bajo ? '#DC2626' : medio ? '#D97706' : '#15803D' }}>
                            {e.creditos_disponibles}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm font-semibold text-gray-700">{e.creditos_consumidos}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${e.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {e.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(ev) => { ev.stopPropagation(); navigate(`/${tenantId}/certificaciones/empresa/${e.id}`); }}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" /> Ver Perfil
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtradas.length === 0 && (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">No hay empresas</p>
                <button
                  onClick={() => navigate(`/${tenantId}/certificaciones/registrar-empresa`)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold"
                >
                  <Plus className="w-5 h-5" /> Registrar Primera Empresa
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
