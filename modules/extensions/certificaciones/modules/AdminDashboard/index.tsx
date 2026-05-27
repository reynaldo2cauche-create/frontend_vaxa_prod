import { useParams, useNavigate } from 'react-router-dom';
import { Users, FileBadge, BookOpen, Layers, GraduationCap, ArrowRight } from '@/components/ui/icon';
import { useProgramas } from '../../shared/hooks/useProgramas';
import { useGrupos } from '../../shared/hooks/useGrupos';
import { useInscripciones } from '../../shared/hooks/useInscripciones';
import { useCertificados } from '../../shared/hooks/useCertificados';

const ESTADOS_INSCRIPCION = [
  { estadoId: 1, label: 'Inscritos',    color: 'bg-blue-50 text-blue-700' },
  { estadoId: 2, label: 'En curso',     color: 'bg-amber-50 text-amber-700' },
  { estadoId: 3, label: 'Aprobados',    color: 'bg-emerald-50 text-emerald-700' },
  { estadoId: 4, label: 'Desaprobados', color: 'bg-red-50 text-red-600' },
  { estadoId: 5, label: 'Retirados',    color: 'bg-gray-100 text-gray-500' },
  { estadoId: 6, label: 'Rechazados',   color: 'bg-orange-50 text-orange-700' },
];

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  iconBg: string;
  href?: string;
  onClick?: () => void;
}

function StatCard({ icon, label, value, iconBg, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] p-5 text-left hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-0.5 w-full">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all mt-1" />
      </div>
      <p className="text-[28px] font-bold text-gray-900 leading-none">{value}</p>
      <p className="text-[13px] text-gray-500 mt-1.5">{label}</p>
    </button>
  );
}

export default function AdminDashboard() {
  const { empresa } = useParams<{ empresa: string }>();
  const navigate = useNavigate();
  const base = `/${empresa}/certificados/admin`;

  const { programas } = useProgramas(empresa!);
  const { grupos }    = useGrupos(empresa!);
  const { inscripciones } = useInscripciones(empresa!);
  const { certificados }  = useCertificados(empresa!);

  const aprobados = inscripciones.filter(i => i.estado_id === 3).length;
  const emitidos  = certificados.filter(c => c.estado_id === 1).length;
  const pendientes = aprobados - emitidos;

  return (
    <div className="space-y-6 page-enter">
      <div>
        <p className="text-[12px] font-semibold text-indigo-500 uppercase tracking-widest mb-1">Panel de control</p>
        <h1 className="text-[22px] font-semibold tracking-tight text-gray-950 capitalize">{empresa}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Resumen del sistema de certificados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 stagger-1 page-enter">
        <StatCard
          icon={<BookOpen size={18} className="text-indigo-600" />}
          label="Programas" value={programas.length}
          iconBg="bg-indigo-50"
          onClick={() => navigate(`${base}/programas`)}
        />
        <StatCard
          icon={<Layers size={18} className="text-violet-600" />}
          label="Grupos" value={grupos.length}
          iconBg="bg-violet-50"
          onClick={() => navigate(`${base}/grupos`)}
        />
        <StatCard
          icon={<Users size={18} className="text-sky-600" />}
          label="Inscritos" value={inscripciones.length}
          iconBg="bg-sky-50"
          onClick={() => navigate(`${base}/inscripciones`)}
        />
        <StatCard
          icon={<FileBadge size={18} className="text-emerald-600" />}
          label="Certificados emitidos" value={emitidos}
          iconBg="bg-emerald-50"
          onClick={() => navigate(`${base}/certificados`)}
        />
      </div>

      {/* Alerta de pendientes */}
      {pendientes > 0 && (
        <button
          onClick={() => navigate(`${base}/certificados`)}
          className="group w-full bg-white border border-amber-200 rounded-2xl px-5 py-4 flex items-center justify-between hover:border-amber-400 hover:shadow-[0_4px_12px_0_rgba(245,158,11,0.15)] transition-all duration-200 stagger-2 page-enter">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <GraduationCap size={17} className="text-amber-600" />
            </div>
            <div className="text-left">
              <p className="text-[14px] font-semibold text-gray-900">
                {pendientes} alumno{pendientes !== 1 ? 's' : ''} aprobado{pendientes !== 1 ? 's' : ''} sin certificado
              </p>
              <p className="text-[12px] text-gray-500">Ir a certificados para emitirlos</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-amber-500 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </button>
      )}

      {/* Distribución de estados */}
      <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-5 stagger-3 page-enter">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] font-semibold text-gray-900">Estado de inscripciones</p>
          <span className="text-[12px] text-gray-400">{inscripciones.length} total</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ESTADOS_INSCRIPCION.map(({ estadoId, label, color }) => {
            const count = inscripciones.filter(i => i.estado_id === estadoId).length;
            const pct = inscripciones.length > 0 ? Math.round((count / inscripciones.length) * 100) : 0;
            return (
              <div key={estadoId}
                className={`rounded-xl px-3.5 py-2.5 flex items-center justify-between ${color}`}>
                <div>
                  <p className="text-[11px] font-medium opacity-80">{label}</p>
                  <p className="text-[18px] font-bold leading-tight">{count}</p>
                </div>
                <span className="text-[11px] font-semibold opacity-60">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grupos recientes */}
      {grupos.length > 0 && (
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden stagger-4 page-enter">
          <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
            <p className="text-[14px] font-semibold text-gray-900">Grupos activos</p>
            <button onClick={() => navigate(`${base}/grupos`)}
              className="text-[12px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {grupos.filter(g => g.activo).slice(0, 4).map(g => (
              <button key={g.id}
                onClick={() => navigate(`${base}/inscripciones?grupo=${g.id}&nombre=${encodeURIComponent(g.nombre_grupo)}`)}
                className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50/80 transition-colors group text-left">
                <div>
                  <p className="text-[13px] font-medium text-gray-800">{g.nombre_grupo}</p>
                  <p className="text-[11px] text-gray-400">{g.programa_nombre} · {g.modalidad_nombre}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-400">
                    {inscripciones.filter(i => i.grupo_id === g.id).length} inscritos
                  </span>
                  <ArrowRight size={13} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
