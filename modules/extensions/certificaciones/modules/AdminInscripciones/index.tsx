import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  ClipboardList, Loader2, AlertCircle, Search, ChevronLeft,
  Users, ArrowRight, UserCheck,
} from '@/components/ui/icon';
import { useInscripciones } from '../../shared/hooks/useInscripciones';
import { useGrupos } from '../../shared/hooks/useGrupos';
import type { Inscripcion } from '../../shared/types';

const ESTADOS: Record<number, { label: string; bg: string; text: string }> = {
  1: { label: 'Inscrito',    bg: 'bg-blue-50',   text: 'text-blue-700' },
  2: { label: 'En curso',    bg: 'bg-amber-50',  text: 'text-amber-700' },
  3: { label: 'Aprobado',    bg: 'bg-emerald-50', text: 'text-emerald-700' },
  4: { label: 'Desaprobado', bg: 'bg-red-50',    text: 'text-red-600' },
  5: { label: 'Retirado',    bg: 'bg-gray-100',  text: 'text-gray-500' },
  6: { label: 'Rechazado',   bg: 'bg-orange-50', text: 'text-orange-700' },
};

const TRANSICIONES: Record<number, number[]> = {
  1: [2, 6],
  2: [3, 4, 5],
  3: [], 4: [], 5: [], 6: [],
};

function EstadoBadge({ estadoId }: { estadoId: number }) {
  const e = ESTADOS[estadoId] ?? { label: 'Desconocido', bg: 'bg-gray-100', text: 'text-gray-500' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${e.bg} ${e.text}`}>
      {e.label}
    </span>
  );
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
    <div className="group bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-4 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] transition-all duration-200">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Users size={15} className="text-gray-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-gray-900 leading-tight">{inscripcion.participante_nombre}</p>
            <p className="text-[12px] text-gray-400 mt-0.5">{inscripcion.numero_documento}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <EstadoBadge estadoId={inscripcion.estado_id} />
          {siguientes.map(nuevoEstado => (
            <button key={nuevoEstado}
              onClick={() => handleCambio(nuevoEstado)}
              disabled={loading}
              className={`flex items-center gap-1.5 text-[12px] px-2.5 py-1 border rounded-xl font-medium transition-all disabled:opacity-40 ${
                nuevoEstado === 3
                  ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                  : nuevoEstado === 4
                  ? 'border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-800'
              }`}>
              {loading ? <Loader2 size={11} className="animate-spin" /> : <ArrowRight size={11} />}
              {ESTADOS[nuevoEstado]?.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
        <p className="text-[11px] text-gray-400">
          Grupo: <span className="text-gray-600 font-medium">{inscripcion.nombre_grupo}</span>
        </p>
        <p className="text-[11px] text-gray-400">
          Inscrito: {new Date(inscripcion.fecha_inscripcion).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}

export default function AdminInscripciones() {
  const { empresa } = useParams<{ empresa: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const grupoIdParam = searchParams.get('grupo');
  const grupoNombre = searchParams.get('nombre');
  const grupoId = grupoIdParam ? Number(grupoIdParam) : undefined;

  const { inscripciones, loading, error, cambiarEstado } = useInscripciones(empresa!, grupoId);
  const { grupos } = useGrupos(empresa!);

  const [filtroEstado, setFiltroEstado] = useState<number | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');

  const handleCambiarEstado = async (id: number, estado: number) => {
    try { await cambiarEstado(id, estado); }
    catch (e: unknown) { alert((e as Error).message); }
  };

  const handleGrupoChange = (val: string) => {
    if (!val) {
      navigate(`/${empresa}/certificados/admin/inscripciones`);
    } else {
      const g = grupos.find(g => g.id === Number(val));
      const nombre = g ? `&nombre=${encodeURIComponent(g.nombre_grupo)}` : '';
      navigate(`/${empresa}/certificados/admin/inscripciones?grupo=${val}${nombre}`);
    }
  };

  const filtradas = inscripciones.filter(i => {
    const coincideEstado = filtroEstado === 'todos' || i.estado_id === filtroEstado;
    const q = busqueda.toLowerCase();
    const coincideBusqueda = !q ||
      i.participante_nombre.toLowerCase().includes(q) ||
      i.numero_documento.includes(q);
    return coincideEstado && coincideBusqueda;
  });

  const resumen = Object.entries(ESTADOS).map(([id, e]) => ({
    estadoId: Number(id),
    label: e.label,
    count: inscripciones.filter(i => i.estado_id === Number(id)).length,
    bg: e.bg,
    text: e.text,
  })).filter(r => r.count > 0);

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div>
        {grupoId && (
          <button
            onClick={() => navigate(`/${empresa}/certificados/admin/grupos`)}
            className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-700 transition-colors mb-3 font-medium">
            <ChevronLeft size={14} />
            Volver a grupos
          </button>
        )}
        <h1 className="text-[22px] font-semibold tracking-tight text-gray-950">
          {grupoNombre ? grupoNombre : 'Inscripciones'}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {grupoId ? 'Participantes de este grupo' : 'Gestiona el estado de cada participante'}
        </p>
      </div>

      {/* Selector de grupo + filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={grupoId ?? ''}
          onChange={e => handleGrupoChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all text-gray-700">
          <option value="">Todos los grupos</option>
          {grupos.map(g => <option key={g.id} value={g.id}>{g.nombre_grupo}</option>)}
        </select>

        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar por nombre o documento..."
            value={busqueda} onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
        </div>

        <select value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value === 'todos' ? 'todos' : +e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all text-gray-700">
          <option value="todos">Todos los estados</option>
          {Object.entries(ESTADOS).map(([id, { label }]) => (
            <option key={id} value={id}>{label}</option>
          ))}
        </select>
      </div>

      {/* Resumen rápido */}
      {!loading && resumen.length > 0 && (
        <div className="flex flex-wrap gap-2 stagger-1 page-enter">
          {resumen.map(r => (
            <button key={r.estadoId}
              onClick={() => setFiltroEstado(filtroEstado === r.estadoId ? 'todos' : r.estadoId)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold transition-all border ${
                filtroEstado === r.estadoId
                  ? `${r.bg} ${r.text} border-current scale-105`
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}>
              <UserCheck size={11} />
              {r.label}
              <span className="font-bold">{r.count}</span>
            </button>
          ))}
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

      {!loading && filtradas.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <ClipboardList size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">Sin inscripciones</p>
          <p className="text-xs text-gray-400 mt-1">
            {busqueda || filtroEstado !== 'todos' ? 'Prueba con otros filtros' : 'Este grupo no tiene inscritos aún'}
          </p>
        </div>
      )}

      <div className="space-y-2.5">
        {filtradas.map((i, idx) => (
          <div key={i.id} className={`stagger-${Math.min(idx + 1, 4) as 1 | 2 | 3 | 4} page-enter`}>
            <InscripcionRow inscripcion={i} onCambiarEstado={handleCambiarEstado} />
          </div>
        ))}
      </div>
    </div>
  );
}
