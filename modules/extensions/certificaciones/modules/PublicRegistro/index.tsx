import { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { GraduationCap, CheckCircle, Loader2, AlertCircle, UserPlus } from '@/components/ui/icon';
import { publicApi } from '../../shared/api/public.api';
import { ApiError } from '@/lib/api/client';
import type { Catalogos, Grupo, RegistroPublicoDto } from '../../shared/types';

type Paso = 'formulario' | 'exito';

const NOMBRE_MAX   = 100;
const APELLIDO_MAX = 100;
const DOC_MAX      = 20;

export default function PublicRegistro() {
  const { empresa } = useParams<{ empresa: string }>();
  const [paso, setPaso] = useState<Paso>('formulario');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [catalogos, setCatalogos] = useState<Catalogos | null>(null);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [inscripcionId, setInscripcionId] = useState<number | null>(null);

  const [form, setForm] = useState<RegistroPublicoDto>({
    tipo_documento_id: 0,
    numero_documento: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    grupo_id: 0,
  });

  useEffect(() => {
    Promise.all([
      publicApi.getCatalogos(empresa!),
      publicApi.getGrupos(empresa!),
    ]).then(([cat, grp]) => {
      setCatalogos(cat);
      setGrupos(grp);
    }).catch(() => {
      setError('No se pudo cargar la información. Intenta recargar la página.');
    }).finally(() => setLoadingData(false));
  }, [empresa]);

  const set = (field: keyof RegistroPublicoDto, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.tipo_documento_id || !form.grupo_id) {
      setError('Selecciona tipo de documento y programa');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { inscripcion_id } = await publicApi.registro(empresa!, form);
      setInscripcionId(inscripcion_id);
      setPaso('exito');
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.status === 409
          ? 'Ya estás inscrito en este grupo con ese documento.'
          : e.message
        );
      } else {
        setError('Error al procesar tu registro. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNuevo = () => {
    setPaso('formulario');
    setForm({ tipo_documento_id: 0, numero_documento: '', nombres: '', apellidos: '', email: '', telefono: '', grupo_id: 0 });
    setError(null);
  };

  // ── Pantalla de éxito ────────────────────────────────────────────────────
  if (paso === 'exito') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Registro exitoso!</h1>
          <p className="text-gray-500 text-sm">Tu inscripción ha sido registrada correctamente.</p>
          {inscripcionId && (
            <p className="text-xs text-gray-400 mt-1">N.° de inscripción: <strong>#{inscripcionId}</strong></p>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Al aprobar el programa, recibirás tu certificado digital.
          </p>
          <button onClick={handleNuevo}
            className="mt-6 text-sm text-indigo-600 hover:underline">
            Registrar otro participante
          </button>
        </div>
      </div>
    );
  }

  // ── Formulario ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-10 px-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg mb-4">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Inscripción al programa</h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{empresa}</p>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-12 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">

            {/* Programa / Grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Programa al que te inscribes <span className="text-red-500">*</span>
              </label>
              <select required value={form.grupo_id}
                onChange={e => set('grupo_id', +e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value={0} disabled>Selecciona el programa</option>
                {grupos.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.programa_nombre} — {g.nombre_grupo} ({g.modalidad_nombre})
                  </option>
                ))}
              </select>
              {grupos.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">No hay programas disponibles actualmente.</p>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Documento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tipo de doc. <span className="text-red-500">*</span>
                </label>
                <select required value={form.tipo_documento_id}
                  onChange={e => set('tipo_documento_id', +e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value={0} disabled>Tipo</option>
                  {catalogos?.tipos_documento.map(td => (
                    <option key={td.id} value={td.id}>{td.codigo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  N.° de documento <span className="text-red-500">*</span>
                </label>
                <input type="text" required maxLength={DOC_MAX}
                  value={form.numero_documento}
                  onChange={e => set('numero_documento', e.target.value)}
                  placeholder="12345678"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            {/* Nombres y apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input type="text" required maxLength={NOMBRE_MAX}
                  value={form.nombres}
                  onChange={e => set('nombres', e.target.value)}
                  placeholder="María Fernanda"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input type="text" required maxLength={APELLIDO_MAX}
                  value={form.apellidos}
                  onChange={e => set('apellidos', e.target.value)}
                  placeholder="García López"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            {/* Email y teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo</label>
                <input type="email" value={form.email ?? ''}
                  onChange={e => set('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
                <input type="tel" value={form.telefono ?? ''}
                  onChange={e => set('telefono', e.target.value)}
                  placeholder="999 999 999"
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {loading ? 'Registrando...' : 'Inscribirme'}
            </button>

            <p className="text-center text-xs text-gray-400">
              ¿Ya tienes certificado?{' '}
              <a href={`/${empresa}/certificados/validar`} className="text-indigo-500 hover:underline">
                Verificarlo aquí
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
