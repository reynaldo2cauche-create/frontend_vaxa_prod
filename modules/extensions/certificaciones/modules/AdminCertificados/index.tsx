import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileBadge, Loader2, AlertCircle, Ban, Download } from '@/components/ui/icon';
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

  const handleGenerar = async (inscripcionId: number) => {
    setGenerando(inscripcionId);
    try { await generar(inscripcionId); }
    catch (e: unknown) { alert((e as Error).message); }
    finally { setGenerando(null); }
  };

  const handleAnular = async (id: number) => {
    if (!confirm('¿Anular este certificado?')) return;
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
      const enriched = {
        ...cert,
        tipo_programa_nombre: programa.tipo_programa_nombre,
        horas_academicas: programa.horas_academicas,
        fecha_inicio: '',
        fecha_fin: '',
        modalidad_nombre: '',
        empresa_nombre: empresa!,
      };
      setPreview({ cert: enriched, config });
    } catch (e: unknown) {
      alert('No se pudo cargar la configuración: ' + (e as Error).message);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Certificados</h1>
        <p className="text-sm text-gray-500">Emite y gestiona certificados</p>
      </div>

      {/* Pendientes de emitir */}
      {aprobadosSinCert.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-amber-800 mb-3">
            {aprobadosSinCert.length} aprobado(s) sin certificado
          </p>
          <div className="space-y-2">
            {aprobadosSinCert.map(i => (
              <div key={i.id} className="flex items-center justify-between bg-white rounded-lg border border-amber-100 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{i.participante_nombre}</p>
                  <p className="text-xs text-gray-500">{i.numero_documento} · {i.nombre_grupo}</p>
                </div>
                <button
                  onClick={() => handleGenerar(i.id)}
                  disabled={generando === i.id}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-lg transition-colors">
                  {generando === i.id ? <Loader2 size={12} className="animate-spin" /> : <FileBadge size={12} />}
                  Emitir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="flex justify-center py-12 text-gray-400"><Loader2 size={24} className="animate-spin" /></div>}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {!loading && certificados.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FileBadge size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No hay certificados emitidos</p>
        </div>
      )}

      <div className="space-y-3">
        {certificados.map(c => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{c.participante_nombre}</p>
                <p className="text-xs text-gray-500">{c.numero_documento}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.programa_nombre} · {c.nombre_grupo}</p>
                <p className="text-xs font-mono text-gray-400 mt-1">{c.codigo_unico}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  c.estado_id === 1 ? 'bg-green-100 text-green-700' :
                  c.estado_id === 2 ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {c.estado_nombre}
                </span>
                {c.estado_id === 1 && (
                  <>
                    <button onClick={() => handleVerPDF(c)}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Download size={11} /> PDF
                    </button>
                    <button onClick={() => handleAnular(c.id)}
                      disabled={anulando === c.id}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                      {anulando === c.id ? <Loader2 size={11} className="animate-spin" /> : <Ban size={11} />}
                      Anular
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Emitido: {new Date(c.fecha_emision).toLocaleDateString('es-PE')}
            </p>
          </div>
        ))}
      </div>

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
