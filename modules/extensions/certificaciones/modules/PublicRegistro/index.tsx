import { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { GraduationCap, CheckCircle, Loader2, AlertCircle, UserPlus } from '@/components/ui/icon';
import { publicApi } from '../../shared/api/public.api';
import { ApiError }  from '@/lib/api/client';
import type { Catalogos, Grupo, RegistroPublicoDto } from '../../shared/types';

type Paso = 'formulario' | 'exito';

const NOMBRE_MAX   = 100;
const APELLIDO_MAX = 100;
const DOC_MAX      = 20;

export default function PublicRegistro() {
  const { empresa } = useParams<{ empresa: string }>();
  const [paso,          setPaso]         = useState<Paso>('formulario');
  const [loading,       setLoading]      = useState(false);
  const [loadingData,   setLoadingData]  = useState(true);
  const [error,         setError]        = useState<string | null>(null);
  const [catalogos,     setCatalogos]    = useState<Catalogos | null>(null);
  const [grupos,        setGrupos]       = useState<Grupo[]>([]);
  const [inscripcionId, setInscripcionId] = useState<number | null>(null);

  const [form, setForm] = useState<RegistroPublicoDto>({
    tipo_documento_id: 0, numero_documento: '', nombres: '',
    apellidos: '', email: '', telefono: '', grupo_id: 0,
  });
  const [yaRegistrado, setYaRegistrado] = useState(false);
  const [buscando,     setBuscando]     = useState(false);

  useEffect(() => {
    Promise.all([publicApi.getCatalogos(empresa!), publicApi.getGrupos(empresa!)])
      .then(([cat, grp]) => { setCatalogos(cat); setGrupos(grp); })
      .catch(() => setError('No se pudo cargar la información. Intenta recargar la página.'))
      .finally(() => setLoadingData(false));
  }, [empresa]);

  const set = (field: keyof RegistroPublicoDto, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }));

  // Autocompletado: al terminar de escribir el documento, busca si ya está registrado.
  useEffect(() => {
    const d = form.numero_documento.trim();
    if (d.length < 6) return;
    const t = setTimeout(async () => {
      setBuscando(true);
      try {
        const p = await publicApi.buscarParticipante(empresa!, d);
        setForm(f => ({
          ...f,
          tipo_documento_id: p.tipo_documento_id || f.tipo_documento_id,
          nombres: p.nombres, apellidos: p.apellidos,
          email: p.email ?? '', telefono: p.telefono ?? '',
        }));
        setYaRegistrado(true);
      } catch {
        setYaRegistrado(false);   // no registrado → datos editables
      } finally { setBuscando(false); }
    }, 450);
    return () => clearTimeout(t);
  }, [form.numero_documento, empresa]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.tipo_documento_id || !form.grupo_id) { setError('Selecciona tipo de documento y programa'); return; }
    setLoading(true); setError(null);
    try {
      const { inscripcion_id } = await publicApi.registro(empresa!, form);
      setInscripcionId(inscripcion_id);
      setPaso('exito');
    } catch (e) {
      setError(e instanceof ApiError
        ? e.message   // ej. "Ya estás inscrito en este programa (grupo X)."
        : 'Error al procesar tu registro. Intenta nuevamente.'
      );
    } finally { setLoading(false); }
  };

  const handleNuevo = () => {
    setPaso('formulario');
    setForm({ tipo_documento_id: 0, numero_documento: '', nombres: '', apellidos: '', email: '', telefono: '', grupo_id: 0 });
    setError(null);
    setYaRegistrado(false);
  };

  /* ── Éxito ────────────────────────────────────────────────── */
  if (paso === 'exito') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: '#F5F4F0' }}>
        <div
          className="w-full max-w-sm rounded-2xl p-8 text-center page-enter"
          style={{ background: '#FFFFFF', border: '1px solid #EEECE6', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: '#F0FDF4', border: '2px solid #BBF7D0' }}
          >
            <CheckCircle size={32} style={{ color: '#15803D' }} />
          </div>
          <h1 className="text-[22px] font-bold mb-2" style={{ color: '#0D0E12' }}>¡Registro exitoso!</h1>
          <p className="text-[14px]" style={{ color: '#6B7280' }}>Tu inscripción ha sido registrada correctamente.</p>
          {inscripcionId && (
            <p className="text-[12px] mt-2 font-mono" style={{ color: '#B0A898' }}>
              N.° de inscripción: <strong style={{ color: '#0D0E12' }}>#{inscripcionId}</strong>
            </p>
          )}
          <div
            className="my-5 rounded-xl px-4 py-3 text-[13px]"
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }}
          >
            Al aprobar el programa, recibirás tu certificado digital.
          </div>
          <button
            onClick={handleNuevo}
            className="text-[13px] font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#D97706' }}
          >
            Registrar otro participante →
          </button>
        </div>
      </div>
    );
  }

  /* ── Formulario ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen py-10 px-4" style={{ background: '#F5F4F0' }}>
      <div className="w-full max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}
          >
            <GraduationCap size={26} style={{ color: '#D97706' }} />
          </div>
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: '#0D0E12' }}>
            Inscripción al programa
          </h1>
          <p className="text-[14px] mt-1 capitalize" style={{ color: '#9CA3AF' }}>{empresa}</p>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-12" style={{ color: '#D1D5DB' }}>
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
          <div
            className="rounded-2xl p-6 page-enter"
            style={{ background: '#FFFFFF', border: '1px solid #EEECE6', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Programa */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#374151' }}>
                  Programa al que te inscribes <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select required value={form.grupo_id} onChange={e => set('grupo_id', +e.target.value)} className="vx-input">
                  <option value={0} disabled>Selecciona el programa</option>
                  {grupos.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.programa_nombre} — {g.nombre_grupo} ({g.modalidad_nombre})
                    </option>
                  ))}
                </select>
                {grupos.length === 0 && (
                  <p className="text-[12px] mt-1" style={{ color: '#D97706' }}>No hay programas disponibles actualmente.</p>
                )}
              </div>

              <div className="h-px" style={{ background: '#F0EEE9' }} />

              {/* Documento */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#374151' }}>
                    Tipo de doc. <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select required value={form.tipo_documento_id} onChange={e => set('tipo_documento_id', +e.target.value)} className="vx-input" disabled={yaRegistrado}>
                    <option value={0} disabled>Tipo</option>
                    {catalogos?.tipos_documento.map(td => (
                      <option key={td.id} value={td.id}>{td.codigo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#374151' }}>
                    N.° de documento <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div className="relative">
                    <input type="text" required maxLength={DOC_MAX} value={form.numero_documento}
                      onChange={e => { set('numero_documento', e.target.value); setYaRegistrado(false); }}
                      placeholder="12345678" className="vx-input" />
                    {buscando && <Loader2 size={14} className="animate-spin absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#D97706' }} />}
                  </div>
                </div>
              </div>
              {yaRegistrado && (
                <p className="text-[12px] flex items-center gap-1 -mt-2" style={{ color: '#15803D' }}>
                  <CheckCircle size={13} /> Ya estás registrado — completamos tus datos. Solo elige el programa.
                </p>
              )}

              {/* Nombres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#374151' }}>
                    Nombres <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input type="text" required maxLength={NOMBRE_MAX} value={form.nombres}
                    onChange={e => set('nombres', e.target.value)} readOnly={yaRegistrado}
                    style={yaRegistrado ? { background: '#F5F4F0', color: '#6B7280' } : undefined}
                    placeholder="María Fernanda" className="vx-input" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#374151' }}>
                    Apellidos <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input type="text" required maxLength={APELLIDO_MAX} value={form.apellidos}
                    onChange={e => set('apellidos', e.target.value)} readOnly={yaRegistrado}
                    style={yaRegistrado ? { background: '#F5F4F0', color: '#6B7280' } : undefined}
                    placeholder="García López" className="vx-input" />
                </div>
              </div>

              {/* Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#374151' }}>
                    Correo <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>opcional</span>
                  </label>
                  <input type="email" value={form.email ?? ''}
                    onChange={e => set('email', e.target.value)} readOnly={yaRegistrado}
                    style={yaRegistrado ? { background: '#F5F4F0', color: '#6B7280' } : undefined}
                    placeholder="correo@ejemplo.com" className="vx-input" />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#374151' }}>
                    Teléfono <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>opcional</span>
                  </label>
                  <input type="tel" value={form.telefono ?? ''}
                    onChange={e => set('telefono', e.target.value)} readOnly={yaRegistrado}
                    style={yaRegistrado ? { background: '#F5F4F0', color: '#6B7280' } : undefined}
                    placeholder="999 999 999" className="vx-input" />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px]"
                  style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}>
                  <AlertCircle size={14} className="flex-shrink-0" /> {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="vx-btn vx-btn-primary w-full py-3">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={15} />}
                {loading ? 'Registrando...' : 'Inscribirme al programa'}
              </button>

              <p className="text-center text-[12px]" style={{ color: '#B0A898' }}>
                ¿Ya tienes certificado?{' '}
                <a href={`/${empresa}/certificados/validar`} className="font-semibold hover:opacity-70 transition-opacity" style={{ color: '#D97706' }}>
                  Verificarlo aquí
                </a>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
