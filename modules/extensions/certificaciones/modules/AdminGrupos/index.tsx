import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Layers, Loader2, X, AlertCircle } from '@/components/ui/icon';
import { useGrupos } from '../../shared/hooks/useGrupos';
import { useProgramas } from '../../shared/hooks/useProgramas';
import { useCatalogos } from '../../shared/hooks/useCatalogos';
import type { CreateGrupoDto } from '../../shared/types';

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
      className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Nuevo grupo</h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Programa</label>
          <select required value={form.programa_id}
            onChange={e => set('programa_id', +e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value={0} disabled>Seleccionar...</option>
            {programas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Modalidad</label>
          <select required value={form.modalidad_id}
            onChange={e => set('modalidad_id', +e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value={0} disabled>Seleccionar...</option>
            {catalogos?.modalidades.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Nombre del grupo</label>
        <input type="text" required maxLength={100} value={form.nombre_grupo}
          onChange={e => set('nombre_grupo', e.target.value)}
          placeholder="Ej: Grupo A — Enero 2026"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Fecha inicio</label>
          <input type="date" required value={form.fecha_inicio}
            onChange={e => set('fecha_inicio', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Fecha fin</label>
          <input type="date" required value={form.fecha_fin}
            onChange={e => set('fecha_fin', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors">
          {loading && <Loader2 size={14} className="animate-spin" />}
          Guardar
        </button>
      </div>
    </form>
  );
}

export default function AdminGrupos() {
  const { empresa } = useParams<{ empresa: string }>();
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

  const formatDate = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Grupos</h1>
          <p className="text-sm text-gray-500">Ediciones y horarios de cada programa</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} /> Nuevo grupo
          </button>
        )}
      </div>

      {showForm && (
        <div>
          {saveError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
              <AlertCircle size={14} /> {saveError}
            </div>
          )}
          <GrupoForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={saving} />
        </div>
      )}

      {loading && <div className="flex justify-center py-12 text-gray-400"><Loader2 size={24} className="animate-spin" /></div>}
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</div>}

      {!loading && grupos.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Layers size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No hay grupos registrados</p>
        </div>
      )}

      <div className="space-y-3">
        {grupos.map(g => (
          <div key={g.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                    {g.programa_nombre}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {g.modalidad_nombre}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{g.nombre_grupo}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDate(g.fecha_inicio)} — {formatDate(g.fecha_fin)}
                </p>
              </div>
              <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${g.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {g.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
