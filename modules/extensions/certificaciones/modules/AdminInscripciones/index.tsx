import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardList, Loader2, UserCheck, AlertCircle, Search } from '@/components/ui/icon';
import { useInscripciones } from '../../shared/hooks/useInscripciones';
import type { Inscripcion } from '../../shared/types';

const ESTADOS: Record<number, { label: string; color: string }> = {
  1: { label: 'Inscrito',    color: 'bg-blue-100 text-blue-700' },
  2: { label: 'En curso',    color: 'bg-yellow-100 text-yellow-700' },
  3: { label: 'Aprobado',    color: 'bg-green-100 text-green-700' },
  4: { label: 'Desaprobado', color: 'bg-red-100 text-red-700' },
  5: { label: 'Retirado',    color: 'bg-gray-100 text-gray-600' },
  6: { label: 'Rechazado',   color: 'bg-orange-100 text-orange-700' },
};

const TRANSICIONES: Record<number, number[]> = {
  1: [2, 6],
  2: [3, 4, 5],
  3: [],
  4: [],
  5: [],
  6: [],
};

function EstadoBadge({ estadoId }: { estadoId: number }) {
  const e = ESTADOS[estadoId] ?? { label: 'Desconocido', color: 'bg-gray-100 text-gray-500' };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.color}`}>{e.label}</span>;
}

function InscripcionRow({ inscripcion, onCambiarEstado }: {
  inscripcion: Inscripcion;
  onCambiarEstado: (id: number, estado: number) => void;
}) {
  const [loading, setLoading] = useState(false);
  const siguientes = TRANSICIONES[inscripcion.estado_id] ?? [];

  const handleCambio = async (nuevoEstado: number) => {
    setLoading(true);
    try { await onCambiarEstado(inscripcion.id, nuevoEstado); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{inscripcion.participante_nombre}</p>
          <p className="text-xs text-gray-500">{inscripcion.numero_documento}</p>
          <p className="text-xs text-gray-400 mt-0.5">{inscripcion.nombre_grupo}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <EstadoBadge estadoId={inscripcion.estado_id} />
          {siguientes.map(nuevoEstado => (
            <button key={nuevoEstado}
              onClick={() => handleCambio(nuevoEstado)}
              disabled={loading}
              className="flex items-center gap-1 text-xs px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
              {loading ? <Loader2 size={10} className="animate-spin" /> : <UserCheck size={10} />}
              → {ESTADOS[nuevoEstado]?.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Inscrito: {new Date(inscripcion.fecha_inscripcion).toLocaleDateString('es-PE')}
      </p>
    </div>
  );
}

export default function AdminInscripciones() {
  const { empresa } = useParams<{ empresa: string }>();
  const { inscripciones, loading, error, cambiarEstado } = useInscripciones(empresa!);
  const [filtroEstado, setFiltroEstado] = useState<number | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');

  const handleCambiarEstado = async (id: number, estado: number) => {
    try { await cambiarEstado(id, estado); }
    catch (e: unknown) { alert((e as Error).message); }
  };

  const filtradas = inscripciones.filter(i => {
    const coincideEstado = filtroEstado === 'todos' || i.estado_id === filtroEstado;
    const coincideBusqueda = busqueda === '' ||
      i.participante_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      i.numero_documento.includes(busqueda);
    return coincideEstado && coincideBusqueda;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Inscripciones</h1>
        <p className="text-sm text-gray-500">Gestiona el estado de cada participante</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar por nombre o documento..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value === 'todos' ? 'todos' : +e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="todos">Todos los estados</option>
          {Object.entries(ESTADOS).map(([id, { label }]) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
      </div>

      {loading && <div className="flex justify-center py-12 text-gray-400"><Loader2 size={24} className="animate-spin" /></div>}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {!loading && filtradas.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <ClipboardList size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No hay inscripciones que coincidan</p>
        </div>
      )}

      <div className="space-y-3">
        {filtradas.map(i => (
          <InscripcionRow key={i.id} inscripcion={i} onCambiarEstado={handleCambiarEstado} />
        ))}
      </div>
    </div>
  );
}
