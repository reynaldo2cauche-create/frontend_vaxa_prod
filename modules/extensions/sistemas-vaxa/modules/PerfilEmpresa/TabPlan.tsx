'use client';

import { useState, useEffect, useCallback } from 'react';
import { CreditCard, Loader2, Plus, Clock, AlertCircle } from '@/components/ui/icon';
import {
  creditosAdminApi, type EmpresaCreditos, type MovimientoCredito,
} from '../../shared/api/creditos.admin.api';

interface TabPlanProps {
  empresa: EmpresaCreditos;
  /** Refresca el perfil tras recargar (para actualizar el header). */
  onChange?: () => void;
}

const TIPO_LABEL: Record<MovimientoCredito['tipo'], { txt: string; color: string; bg: string }> = {
  asignacion: { txt: 'Asignación', color: '#1D4ED8', bg: '#EFF6FF' },
  recarga:    { txt: 'Recarga',    color: '#15803D', bg: '#F0FDF4' },
  consumo:    { txt: 'Consumo',    color: '#B91C1C', bg: '#FEF2F2' },
  devolucion: { txt: 'Devolución', color: '#B45309', bg: '#FFFBEB' },
  ajuste:     { txt: 'Ajuste',     color: '#6B7280', bg: '#F3F4F6' },
};

const fmtFecha = (s: string) =>
  new Date(s).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function TabPlan({ empresa, onChange }: TabPlanProps) {
  const [movs, setMovs] = useState<MovimientoCredito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState('');
  const [saving, setSaving] = useState(false);

  const cargarMovs = useCallback(async () => {
    setLoading(true);
    try { setMovs(await creditosAdminApi.movimientos(empresa.id, 20)); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [empresa.id]);

  useEffect(() => { cargarMovs(); }, [cargarMovs]);

  const recargar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const n = Number(cantidad);
    if (!Number.isInteger(n) || n <= 0) return;
    setSaving(true); setError(null);
    try {
      await creditosAdminApi.recargar(empresa.id, n, 'Recarga desde perfil de empresa');
      setCantidad('');
      onChange?.();          // refresca header del perfil
      await cargarMovs();
    } catch (e) { setError((e as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 text-emerald-100 text-sm mb-1">
            <CreditCard className="w-4 h-4" /> Saldo disponible
          </div>
          <p className="text-4xl font-bold">{empresa.creditos_disponibles}</p>
          <p className="text-emerald-100 text-sm mt-2">
            {empresa.creditos_consumidos} consumidos · {empresa.creditos_asignados_total} asignados
          </p>
        </div>

        <form onSubmit={recargar} className="md:col-span-2 bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col justify-center">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Recargar créditos</label>
          <div className="flex gap-2">
            <input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(e.target.value)}
              placeholder="Cantidad a agregar (ej. 100)"
              className="flex-1 px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button type="submit" disabled={saving || !cantidad}
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Recargar
            </button>
          </div>
          {cantidad && Number(cantidad) > 0 && (
            <p className="text-sm text-gray-600 mt-2">Nuevo saldo: <b className="text-emerald-600">{empresa.creditos_disponibles + Number(cantidad)}</b></p>
          )}
        </form>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
          <Clock className="w-5 h-5 text-gray-400" /> Últimos movimientos
        </h3>
        {loading ? (
          <div className="flex justify-center py-8 text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : movs.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center bg-gray-50 rounded-xl border border-gray-200">Sin movimientos todavía.</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {movs.map((m) => {
              const t = TIPO_LABEL[m.tipo];
              return (
                <div key={m.id} className="flex items-center justify-between px-4 py-3 gap-3">
                  <div className="min-w-0">
                    <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: t.bg, color: t.color }}>{t.txt}</span>
                    <p className="text-xs text-gray-500 mt-1 truncate">{m.descripcion ?? '—'} · {fmtFecha(m.created_at)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: m.cantidad >= 0 ? '#15803D' : '#B91C1C' }}>
                      {m.cantidad >= 0 ? '+' : ''}{m.cantidad}
                    </p>
                    <p className="text-xs text-gray-400">saldo {m.saldo_resultante}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
