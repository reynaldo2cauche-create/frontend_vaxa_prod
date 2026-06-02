import { useState, FormEvent } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { QrCode, Search, Loader2, BadgeCheck, XCircle } from '@/components/ui/icon';
import { useValidarCertificado } from '../../shared/hooks/useCertificados';

function formatDate(d: string | Date) {
  if (!d) return '—';
  const s = typeof d === 'string' ? d.substring(0, 10) : d.toISOString().substring(0, 10);
  return new Date(s + 'T12:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5" style={{ borderBottom: '1px solid #F5F4F0' }}>
      <span className="text-[12px] flex-shrink-0" style={{ color: '#9CA3AF' }}>{label}</span>
      <span className="text-[13px] font-semibold text-right" style={{ color: '#0D0E12' }}>{value}</span>
    </div>
  );
}

export default function PublicValidar() {
  const { empresa }      = useParams<{ empresa: string }>();
  const [searchParams]   = useSearchParams();
  const { resultado, loading, error, buscado, validar } = useValidarCertificado();
  const [codigo, setCodigo] = useState(searchParams.get('codigo') ?? '');

  useState(() => {
    const c = searchParams.get('codigo');
    if (c) validar(c);
  });

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); validar(codigo); };

  const valid = resultado && (resultado.estado === 'EMITIDO' || resultado.estado === 'VIGENTE');

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: '#F5F4F0' }}>
      <div className="w-full max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}
          >
            <QrCode size={26} style={{ color: '#D97706' }} />
          </div>
          <h1 className="text-[26px] font-bold tracking-tight" style={{ color: '#0D0E12' }}>
            Verificar certificado
          </h1>
          <p className="text-[14px] mt-1 capitalize" style={{ color: '#9CA3AF' }}>{empresa}</p>
        </div>

        {/* Búsqueda */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-5 mb-5"
          style={{ background: '#FFFFFF', border: '1px solid #EEECE6', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
        >
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#374151' }}>
            Código único del certificado
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
              placeholder="CERT-1-1748..."
              className="vx-input flex-1 font-mono"
              style={{ textTransform: 'uppercase' }}
            />
            <button
              type="submit"
              disabled={loading || !codigo.trim()}
              className="vx-btn vx-btn-primary px-4 flex-shrink-0"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
              Verificar
            </button>
          </div>
        </form>

        {/* Resultado */}
        {buscado && !loading && (
          <>
            {/* No encontrado */}
            {error && (
              <div
                className="rounded-2xl p-8 text-center page-enter"
                style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
              >
                <XCircle size={40} style={{ color: '#FCA5A5', margin: '0 auto 12px' }} />
                <p className="text-[15px] font-bold mb-1" style={{ color: '#0D0E12' }}>Certificado no encontrado</p>
                <p className="text-[13px]" style={{ color: '#9CA3AF' }}>{error}</p>
              </div>
            )}

            {/* Encontrado */}
            {resultado && (
              <div
                className="rounded-2xl overflow-hidden page-enter"
                style={{ background: '#FFFFFF', border: `1px solid ${valid ? '#BBF7D0' : '#FECACA'}` }}
              >
                {/* Banner estado */}
                <div
                  className="px-5 py-3.5 flex items-center gap-2.5"
                  style={{
                    background: valid ? '#F0FDF4' : '#FEF2F2',
                    borderBottom: `1px solid ${valid ? '#BBF7D0' : '#FECACA'}`,
                  }}
                >
                  {valid
                    ? <BadgeCheck size={18} style={{ color: '#15803D' }} />
                    : <XCircle    size={18} style={{ color: '#B91C1C' }} />
                  }
                  <span className="text-[14px] font-bold" style={{ color: valid ? '#15803D' : '#B91C1C' }}>
                    {valid ? 'Certificado válido y auténtico' : `Certificado ${resultado.estado.toLowerCase()}`}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Participante */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#B0A898' }}>
                      Participante
                    </p>
                    <p className="text-[22px] font-bold tracking-tight" style={{ color: '#0D0E12' }}>
                      {resultado.participante_nombre}
                    </p>
                    <p className="text-[13px] mt-0.5" style={{ color: '#9CA3AF' }}>
                      {resultado.tipo_doc}: {resultado.numero_documento}
                    </p>
                  </div>

                  {/* Detalles */}
                  <div
                    className="rounded-xl px-4 py-1"
                    style={{ background: '#FAFAF8', border: '1px solid #EEECE6' }}
                  >
                    <Row label="Programa"  value={resultado.programa_nombre} />
                    <Row label="Grupo"     value={resultado.nombre_grupo} />
                    <Row label="Modalidad" value={resultado.modalidad} />
                    <Row label="Duración"  value={`${resultado.horas_academicas} horas académicas`} />
                    <Row label="Periodo"   value={`${formatDate(resultado.fecha_inicio)} — ${formatDate(resultado.fecha_fin)}`} />
                    <Row label="Emitido por" value={resultado.empresa_nombre} />
                    <div className="flex items-start justify-between gap-4 py-2.5">
                      <span className="text-[12px] flex-shrink-0" style={{ color: '#9CA3AF' }}>Fecha de emisión</span>
                      <span className="text-[13px] font-semibold text-right" style={{ color: '#0D0E12' }}>{formatDate(resultado.fecha_emision)}</span>
                    </div>
                  </div>

                  {/* Código */}
                  <div className="rounded-xl px-4 py-3" style={{ background: '#F5F4F0' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#B0A898' }}>Código único</p>
                    <p className="text-[12px] font-mono break-all" style={{ color: '#374151' }}>{resultado.codigo_unico}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <p className="text-center text-[12px] mt-6">
          <a
            href={`/${empresa}/certificados`}
            className="font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#D97706' }}
          >
            ← Inscripción al programa
          </a>
        </p>
      </div>
    </div>
  );
}
