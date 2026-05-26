import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, BookOpen, Loader2, X, AlertCircle } from '@/components/ui/icon';
import { useProgramas } from '../../shared/hooks/useProgramas';
import { useCatalogos } from '../../shared/hooks/useCatalogos';
import type { CreateProgramaDto } from '../../shared/types';

const NOMBRE_MAX = 100;
const DESC_MAX   = 300;

function ProgramaForm({
  onSubmit, onCancel, loading,
}: {
  onSubmit: (data: CreateProgramaDto) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const { empresa } = useParams<{ empresa: string }>();
  const { catalogos } = useCatalogos(empresa!);
  const [form, setForm] = useState<CreateProgramaDto>({
    tipo_programa_id: 0,
    nombre: '',
    descripcion: '',
    horas_academicas: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Nuevo programa</h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de programa</label>
          <select
            required
            value={form.tipo_programa_id}
            onChange={e => setForm(f => ({ ...f, tipo_programa_id: +e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={0} disabled>Seleccionar...</option>
            {catalogos?.tipos_programa.map(tp => (
              <option key={tp.id} value={tp.id}>{tp.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Horas académicas</label>
          <input
            type="number" min={1} required
            value={form.horas_academicas || ''}
            onChange={e => setForm(f => ({ ...f, horas_academicas: +e.target.value }))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Nombre del programa <span className="text-gray-400">({form.nombre.length}/{NOMBRE_MAX})</span>
        </label>
        <input
          type="text" required maxLength={NOMBRE_MAX}
          value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
          placeholder="Ej: Curso de Excel Avanzado"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Descripción <span className="text-gray-400">opcional · {(form.descripcion ?? '').length}/{DESC_MAX}</span>
        </label>
        <textarea
          rows={2} maxLength={DESC_MAX}
          value={form.descripcion ?? ''}
          onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
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

export default function AdminProgramas() {
  const { empresa } = useParams<{ empresa: string }>();
  const { programas, loading, error, create } = useProgramas(empresa!);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleCreate = async (data: CreateProgramaDto) => {
    setSaving(true);
    setSaveError(null);
    try {
      await create(data);
      setShowForm(false);
    } catch (e: unknown) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Programas</h1>
          <p className="text-sm text-gray-500">Cursos, talleres y diplomados</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} /> Nuevo programa
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
          <ProgramaForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} loading={saving} />
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!loading && programas.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <BookOpen size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No hay programas registrados</p>
        </div>
      )}

      <div className="space-y-3">
        {programas.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                    {p.tipo_programa_nombre}
                  </span>
                  <span className="text-xs text-gray-400">{p.horas_academicas}h</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mt-1">{p.nombre}</p>
                {p.descripcion && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{p.descripcion}</p>
                )}
              </div>
              <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {p.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
