import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Layers, Loader2, X, AlertCircle, Users, ChevronRight, Calendar } from '@/components/ui/icon';
import { useGrupos } from '../../shared/hooks/useGrupos';
import { useProgramas } from '../../shared/hooks/useProgramas';
import { useCatalogos } from '../../shared/hooks/useCatalogos';
import type { CreateGrupoDto, Grupo } from '../../shared/types';

function GrupoForm({ onSubmit, onCancel, loading }: {
  onSubmit: (data: CreateGrupoDto) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const { empresa } = useParams<{ empresa: string }>();
  const { programas } = useProgramas(empresa!);
  const { catalogos } = useCatalogos(empresa!);
  const [form, setForm] = useState<CreateGrupoDto>({
    programa_id: 0, nombre_grupo: '', fecha_inicio: '', fecha_fin: '', modalidad_id: 0,
  });

  const set = (field: keyof CreateGrupoDto, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}
      className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_4px_0_rgba(0,0,0,0.06)] p-5 space-y-4 page-enter">

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Nuevo grupo</h3>
        <button type="button" onClick={onCancel}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Programa</label>
          <select required value={form.programa_id}
            onChange={e => set('programa_id', +e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all">
            <option value={0} disabled>Seleccionar...</option>
            {programas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Modalidad</label>
          <select required value={form.modalidad_id}
            onChange={e => set('modalidad_id', +e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all">
            <option value={0} disabled>Seleccionar...</option>
            {catalogos?.modalidades.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre del grupo</label>
        <input type="text" required maxLength={100} value={form.nombre_grupo}
          onChange={e => set('nombre_grupo', e.target.value)}
          placeholder="Ej: Grupo A — Enero 2026"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Fecha inicio</label>
          <input type="date" required value={form.fecha_inicio}
            onChange={e => set('fecha_inicio', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Fecha fin</label>
          <input type="date" required value={form.fecha_fin}
            onChange={e => set('fecha_fin', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-medium">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl transition-all font-medium shadow-sm">
          {loading && <Loader2 size={13} className="animate-spin" />}
          Guardar grupo
        </button>
      </div>
    </form>
  );
}

function GrupoCard({ grupo, onVerInscritos }: { grupo: Grupo; onVerInscritos: (g: Grupo) => void }) {
  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="group bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-4 hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.08)] transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className="text-[11px] px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">
              {grupo.programa_nombre}
            </span>
            <span className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
              {grupo.modalidad_nombre}
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              grupo.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
            }`}>
              {grupo.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <p className="text-[14px] font-semibold text-gray-900 leading-tight">{grupo.nombre_grupo}</p>
          <div className="flex items-center gap-1.5 mt-1.5 text-[12px] text-gray-400">
            <Calendar size={11} />
            <span>{formatDate(grupo.fecha_inicio)} — {formatDate(grupo.fecha_fin)}</span>
          </div>
        </div>

        <button
          onClick={() => onVerInscritos(grupo)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all group-hover:opacity-100 opacity-0 group-hover:translate-x-0 duration-150 flex-shrink-0">
          <Users size={12} />
          Inscritos
          <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}

export default function AdminGrupos() {
  const { empresa } = useParams<{ empresa: string }>();
  const navigate = useNavigate();
  const { grupos, loading, error, create } = useGrupos(empresa!);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleCreate = async (data: CreateGrupoDto) => {
    setSaving(true); setSaveError(null);
    try { await create(data); setShowForm(false); }
    catch (e: unknown) { setSaveError((e as Error).message); }
    finally { setSaving(false); }
  };

  const handleVerInscritos = (grupo: Grupo) => {
    navigate(`/${empresa}/certificados/admin/inscripciones?grupo=${grupo.id}&nombre=${encodeURIComponent(grupo.nombre_grupo)}`);
  };

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-gray-950">Grupos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ediciones y horarios de cada programa</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium rounded-xl transition-all shadow-sm hover:shadow-md flex-shrink-0">
            <Plus size={15} /> Nuevo grupo
          </button>
        )}
      </div>

      {showForm && (
        <div className="stagger-1">
          {saveError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mb-3">
              <AlertCircle size={14} /> {saveError}
            </div>
          )}
          <GrupoForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={saving} />
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16 text-gray-300">
          <Loader2 size={22} className="animate-spin" />
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {!loading && grupos.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Layers size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">No hay grupos registrados</p>
          <p className="text-xs text-gray-400 mt-1">Crea el primer grupo para empezar</p>
        </div>
      )}

      <div className="space-y-3">
        {grupos.map((g, i) => (
          <div key={g.id} className={`stagger-${Math.min(i + 1, 4) as 1 | 2 | 3 | 4} page-enter`}>
            <GrupoCard grupo={g} onVerInscritos={handleVerInscritos} />
          </div>
        ))}
      </div>
    </div>
  );
}
