import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Loader2 } from '@/components/ui/icon';
import type { Certificado, ConfigCertificado } from '../types';

interface Props {
  certificado: Certificado & {
    tipo_programa_nombre: string;
    horas_academicas: number;
    fecha_inicio: string;
    fecha_fin: string;
    modalidad_nombre: string;
    empresa_nombre: string;
  };
  config: ConfigCertificado;
  onClose: () => void;
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('es-PE', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function CertificadoPDF({ certificado, config, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const qrUrl = `${window.location.origin}/${certificado.empresa_id}/certificados/validar/${certificado.codigo_unico}`;

  const handleDescargar = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
    pdf.save(`certificado-${certificado.codigo_unico}.pdf`);
  };

  const cuerpoTexto = `Por haber completado satisfactoriamente ${
    certificado.tipo_programa_nombre
  } "${certificado.programa_nombre}" con una duración de ${
    certificado.horas_academicas
  } horas académicas, realizado del ${formatDate(certificado.fecha_inicio)} al ${formatDate(certificado.fecha_fin)}.`;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-900">Vista previa del certificado</p>
          <div className="flex gap-2">
            <button onClick={handleDescargar}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
              <Download size={14} /> Descargar PDF
            </button>
            <button onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cerrar
            </button>
          </div>
        </div>

        {/* Certificado renderizable */}
        <div className="overflow-auto p-4 bg-gray-100">
          <div
            ref={ref}
            className="relative mx-auto overflow-hidden"
            style={{ width: 900, height: 636, fontFamily: 'serif' }}
          >
            {/* Fondo */}
            {config.plantilla_url && (
              <img src={config.plantilla_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            )}

            {/* Contenido sobre el fondo */}
            <div className="absolute inset-0 flex flex-col items-center px-16 py-10">
              {/* Logo */}
              {config.logo_imagen && (
                <img src={config.logo_imagen} alt="logo" className="h-16 object-contain mb-4" crossOrigin="anonymous" />
              )}

              {/* Título */}
              <p className="text-xl font-bold tracking-widest text-gray-700 uppercase mb-4">
                Certificado de {certificado.tipo_programa_nombre}
              </p>

              {/* Nombre del participante */}
              <p className="text-4xl font-bold text-center leading-tight text-gray-900 mb-5" style={{ maxWidth: 700 }}>
                {certificado.participante_nombre}
              </p>

              {/* Cuerpo */}
              <p className="text-sm text-center text-gray-700 leading-relaxed mb-3" style={{ maxWidth: 560 }}>
                {cuerpoTexto}
              </p>

              {/* Nombre del programa en cursiva */}
              <p className="text-base italic text-gray-600 mb-auto">
                &ldquo;{certificado.programa_nombre}&rdquo;
              </p>

              {/* Firmas + QR */}
              <div className="w-full flex items-end justify-between mt-4">
                {/* Fecha y duración */}
                <div className="text-xs text-gray-600 space-y-0.5">
                  <p>Fecha: {formatDate(certificado.fecha_emision)}</p>
                  <p>Duración: {certificado.horas_academicas} horas</p>
                </div>

                {/* Firmas */}
                <div className="flex gap-10 justify-center">
                  {[
                    { img: config.firma_1_imagen, nombre: config.firma_1_nombre, cargo: config.firma_1_cargo },
                    { img: config.firma_2_imagen, nombre: config.firma_2_nombre, cargo: config.firma_2_cargo },
                  ].filter(f => f.nombre).map((firma, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      {firma.img && (
                        <img src={firma.img} alt="firma" className="h-12 object-contain mb-1" crossOrigin="anonymous" />
                      )}
                      <div className="border-t border-gray-400 w-32 mb-1" />
                      <p className="text-xs font-semibold text-gray-800">{firma.nombre}</p>
                      <p className="text-xs text-gray-500">{firma.cargo}</p>
                    </div>
                  ))}
                </div>

                {/* QR */}
                <div className="flex flex-col items-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(qrUrl)}`}
                    alt="QR"
                    className="w-20 h-20"
                    crossOrigin="anonymous"
                  />
                  <p className="text-[9px] text-gray-400 mt-0.5 max-w-[80px] text-center break-all">
                    {certificado.codigo_unico}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BotonGenerarPDF({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors">
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
      {loading ? 'Generando...' : 'PDF'}
    </button>
  );
}
