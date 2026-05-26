import { useState, FormEvent } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { QrCode, Search, Loader2, CheckCircle, XCircle, BadgeCheck } from '@/components/ui/icon';
import { useValidarCertificado } from '../../shared/hooks/useCertificados';

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-PE', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function PublicValidar() {
  const { empresa } = useParams<{ empresa: string }>();
  const [searchParams] = useSearchParams();
  const { resultado, loading, error, buscado, validar } = useValidarCertificado();
  const [codigo, setCodigo] = useState(searchParams.get('codigo') ?? '');

  // Valida automáticamente si viene el código por URL
  useState(() => {
    const c = searchParams.get('codigo');
    if (c) validar(c);
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    validar(codigo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-10 px-4">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg mb-4">
            <QrCode size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verificar certificado</h1>
          <p className="text-sm text-gray-500 mt-1 capitalize">{empresa}</p>
        </div>

        {/* Formulario de búsqueda */}
        <form onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código único del certificado
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
              placeholder="CERT-1-1748..."
              className="flex-1 px-3 py-2.5 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
            />
            <button type="submit" disabled={loading || !codigo.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Verificar
            </button>
          </div>
        </form>

        {/* Resultado */}
        {buscado && !loading && (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <XCircle size={40} className="text-red-400 mx-auto mb-3" />
                <p className="font-semibold text-gray-900 mb-1">Certificado no encontrado</p>
                <p className="text-sm text-gray-500">{error}</p>
              </div>
            )}

            {resultado && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Estado */}
                <div className={`px-5 py-3 flex items-center gap-2 ${
                  resultado.estado === 'EMITIDO' || resultado.estado === 'VIGENTE'
                    ? 'bg-green-50 border-b border-green-100'
                    : 'bg-red-50 border-b border-red-100'
                }`}>
                  {resultado.estado === 'EMITIDO' || resultado.estado === 'VIGENTE' ? (
                    <BadgeCheck size={18} className="text-green-600" />
                  ) : (
                    <XCircle size={18} className="text-red-500" />
                  )}
                  <span className="text-sm font-semibold text-gray-800">
                    {resultado.estado === 'EMITIDO' || resultado.estado === 'VIGENTE'
                      ? 'Certificado válido y auténtico'
                      : `Certificado ${resultado.estado.toLowerCase()}`}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Participante */}
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Participante</p>
                    <p className="text-xl font-bold text-gray-900">{resultado.participante_nombre}</p>
                    <p className="text-sm text-gray-500">{resultado.tipo_doc}: {resultado.numero_documento}</p>
                  </div>

                  {/* Programa */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Programa</span>
                      <span className="font-medium text-gray-900">{resultado.programa_nombre}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Grupo</span>
                      <span className="font-medium text-gray-900">{resultado.nombre_grupo}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Modalidad</span>
                      <span className="font-medium text-gray-900">{resultado.modalidad}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duración</span>
                      <span className="font-medium text-gray-900">{resultado.horas_academicas} horas</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Periodo</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(resultado.fecha_inicio)} — {formatDate(resultado.fecha_fin)}
                      </span>
                    </div>
                  </div>

                  {/* Emisor */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Emitido por</span>
                    <span className="font-medium text-gray-900">{resultado.empresa_nombre}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Fecha de emisión</span>
                    <span className="font-medium text-gray-900">{formatDate(resultado.fecha_emision)}</span>
                  </div>

                  {/* Código */}
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-400">Código único</p>
                    <p className="text-xs font-mono text-gray-600 break-all">{resultado.codigo_unico}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          <a href={`/${empresa}/certificados`} className="hover:text-indigo-500">
            ← Inscripción al programa
          </a>
        </p>
      </div>
    </div>
  );
}
