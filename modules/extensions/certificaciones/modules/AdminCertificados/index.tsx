import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileBadge, Loader2, AlertCircle, Ban, Download, Sparkles, CheckCircle } from '@/components/ui/icon';
import { useCertificados } from '../../shared/hooks/useCertificados';
import { useInscripciones } from '../../shared/hooks/useInscripciones';
import { configApi } from '../../shared/api/config.api';
import { programasApi } from '../../shared/api/programas.api';
import { CertificadoPDF } from '../../shared/components/CertificadoPDF';
import type { Certificado, ConfigCertificado, Programa } from '../../shared/types';

const ESTADO_APROBADO = 3;

export default function AdminCertificados() {
  const { empresa } = useParams<{ empresa: string }>();
  const { certificados, loading, error, generar, anular } = useCertificados(empresa!);
  const { inscripciones } = useInscripciones(empresa!);
  const [generando, setGenerando] = useState<number | null>(null);
  const [anulando, setAnulando] = useState<number | null>(null);
  const [preview, setPreview] = useState<{
    cert: Certificado & { tipo_programa_nombre: string; horas_academicas: number; fecha_inicio: string; fecha_fin: string; modalidad_nombre: string; empresa_nombre: string };
    config: ConfigCertificado;
  } | null>(null);

  const aprobadosSinCert = inscripciones.filter(i =>
    i.estado_id === ESTADO_APROBADO &&
    !certificados.some(c => c.inscripcion_id === i.id && c.estado_id === 1)
  );

  const certActivos = certificados.filter(c => c.estado_id === 1);
  const certAnulados = certificados.filter(c => c.estado_id !== 1);

  const handleGenerar = async (inscripcionId: number) => {
    setGenerando(inscripcionId);
    try { await generar(inscripcionId); }
    catch (e: unknown) { alert((e as Error).message); }
    finally { setGenerando(null); }
  };

  const handleAnular = async (id: number) => {
    if (!confirm('¿Anular este certificado? Esta acción no se puede deshacer.')) return;
    setAnulando(id);
    try { await anular(id); }
    catch (e: unknown) { alert((e as Error).message); }
    finally { setAnulando(null); }
  };

  const handleVerPDF = async (cert: Certificado) => {
    if (!cert.programa_id) {
      alert('No se puede generar el PDF: falta el ID del programa en el certificado.');
      return;
    }
    try {
      const [config, programa] = await Promise.all([
        configApi.get(empresa!, cert.programa_id),
        programasApi.get(empresa!, cert.programa_id),
      ] as [Promise<ConfigCertificado>, Promise<Programa>]);
      setPreview({
        cert: {
          ...cert,
          tipo_programa_nombre: programa.tipo_programa_nombre,
          horas_academicas: programa.horas_academicas,
          fecha_inicio: '',
          fecha_fin: '',
          modalidad_nombre: '',
          empresa_nombre: empresa!,
        },
        config,
      });
    } catch (e: unknown) {
      alert('No se pudo cargar la configuración: ' + (e as Error).message);
    }
  };

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-gray-950">Certificados</h1>
        <p className="text-sm text-gray-500 mt-0.5">Emite y gestiona los certificados de participantes aprobados</p>
      </div>

      {/* Resumen rápido */}
      {!loading && (
        <div className="grid grid-cols-3 gap-3 stagger-1 page-enter">
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{aprobadosSinCert.length}</p>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Por emitir</p>
          </div>
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{certActivos.length}</p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Emitidos</p>
          </div>
          <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-4 text-center">
            <p className="text-2xl font-bold text-gray-400">{certAnulados.length}</p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Anulados</p>
          </div>
        </div>
      )}

      {/* Pendientes de emitir */}
      {aprobadosSinCert.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] overflow-hidden stagger-2 page-enter">
          <div className="px-5 py-3.5 border-b border-amber-100 bg-amber-50 flex items-center gap-2">
            <Sparkles size={15} className="text-amber-600" />
            <p className="text-[13px] font-semibold text-amber-800">
              {aprobadosSinCert.length} aprobado{aprobadosSinCert.length !== 1 ? 's' : ''} sin certificado
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {aprobadosSinCert.map(i => (
              <div key={i.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/60 transition-colors gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-gray-900">{i.participante_nombre}</p>
                  <p className="text-[12px] text-gray-400">{i.numero_documento} · {i.nombre_grupo}</p>
                </div>
                <button
                  onClick={() => handleGenerar(i.id)}
                  disabled={generando === i.id}
                  className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl transition-all font-medium shadow-sm flex-shrink-0">
                  {generando === i.id ? <Loader2 size={12} className="animate-spin" /> : <FileBadge size={12} />}
                  Emitir
                </button>
              </div>
            ))}
          </div>
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

      {!loading && certificados.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <FileBadge size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">No hay certificados emitidos aún</p>
          <p className="text-xs text-gray-400 mt-1">Los certificados aparecerán aquí una vez emitidos</p>
        </div>
      )}

      {/* Lista de certificados emitidos */}
      {certActivos.length > 0 && (
        <div className="stagger-3 page-enter">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Emitidos</p>
          <div className="space-y-2.5">
            {certActivos.map((c, idx) => (
              <div key={c.id}
                className={`group bg-white rounded-2xl border border-black/[0.06] shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] p-4 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.07)] transition-all duration-200 stagger-${Math.min(idx + 1, 4) as 1|2|3|4} page-enter`}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-gray-900 leading-tight">{c.participante_nombre}</p>
                      <p className="text-[12px] text-gray-400">{c.numero_documento}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{c.programa_nombre} · {c.nombre_grupo}</p>
                      <p className="text-[11px] font-mono text-gray-300 mt-1 tracking-wide">{c.codigo_unico}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleVerPDF(c)}
                      className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 rounded-xl transition-all font-medium">
                      <Download size={12} /> PDF
                    </button>
                    <button onClick={() => handleAnular(c.id)}
                      disabled={anulando === c.id}
                      className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-xl transition-all font-medium disabled:opacity-40">
                      {anulando === c.id ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />}
                      Anular
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-2.5 pt-2.5 border-t border-gray-50">
                  Emitido el {new Date(c.fecha_emision).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Anulados */}
      {certAnulados.length > 0 && (
        <div className="stagger-4 page-enter">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Anulados</p>
          <div className="space-y-2">
            {certAnulados.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-black/[0.04] p-3.5 opacity-60">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-gray-700 line-through">{c.participante_nombre}</p>
                    <p className="text-[11px] text-gray-400">{c.codigo_unico}</p>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 bg-red-50 text-red-500 rounded-full font-medium flex-shrink-0">
                    {c.estado_nombre}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {preview && (
        <CertificadoPDF
          certificado={preview.cert}
          config={preview.config}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
