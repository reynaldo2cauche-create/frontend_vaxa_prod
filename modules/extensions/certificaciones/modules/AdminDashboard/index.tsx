import { useParams } from 'react-router-dom';
import { Users, FileBadge, BookOpen, Layers, GraduationCap } from '@/components/ui/icon';
import { useProgramas } from '../../shared/hooks/useProgramas';
import { useGrupos } from '../../shared/hooks/useGrupos';
import { useInscripciones } from '../../shared/hooks/useInscripciones';
import { useCertificados } from '../../shared/hooks/useCertificados';

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: number | string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { empresa } = useParams<{ empresa: string }>();
  const { programas } = useProgramas(empresa!);
  const { grupos } = useGrupos(empresa!);
  const { inscripciones } = useInscripciones(empresa!);
  const { certificados } = useCertificados(empresa!);

  const aprobados = inscripciones.filter(i => i.estado_id === 3).length;
  const emitidos  = certificados.filter(c => c.estado_id === 1).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5 capitalize">{empresa} · Panel de certificados</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen size={20} className="text-indigo-600" />}
          label="Programas" value={programas.length}
          color="bg-indigo-50"
        />
        <StatCard
          icon={<Layers size={20} className="text-purple-600" />}
          label="Grupos" value={grupos.length}
          color="bg-purple-50"
        />
        <StatCard
          icon={<Users size={20} className="text-emerald-600" />}
          label="Inscritos" value={inscripciones.length}
          color="bg-emerald-50"
        />
        <StatCard
          icon={<FileBadge size={20} className="text-amber-600" />}
          label="Certificados emitidos" value={emitidos}
          color="bg-amber-50"
        />
      </div>

      {/* Resumen estado inscripciones */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Estado de inscripciones</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Inscritos',    estadoId: 1, color: 'bg-blue-100 text-blue-700' },
            { label: 'En curso',     estadoId: 2, color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Aprobados',    estadoId: 3, color: 'bg-green-100 text-green-700' },
            { label: 'Desaprobados', estadoId: 4, color: 'bg-red-100 text-red-700' },
            { label: 'Retirados',    estadoId: 5, color: 'bg-gray-100 text-gray-600' },
            { label: 'Rechazados',   estadoId: 6, color: 'bg-orange-100 text-orange-700' },
          ].map(({ label, estadoId, color }) => {
            const count = inscripciones.filter(i => i.estado_id === estadoId).length;
            return (
              <div key={estadoId} className={`rounded-lg px-3 py-2 flex items-center justify-between ${color}`}>
                <span className="text-xs font-medium">{label}</span>
                <span className="text-sm font-bold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {aprobados > emitidos && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <GraduationCap size={18} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Hay <strong>{aprobados - emitidos}</strong> alumno(s) aprobado(s) sin certificado emitido.
            <a href="certificados" className="ml-1 underline font-medium">Ir a certificados →</a>
          </p>
        </div>
      )}
    </div>
  );
}
