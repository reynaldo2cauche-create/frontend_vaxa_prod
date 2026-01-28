'use client';

import { useState } from 'react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  Type,
  PenTool,
  Eye,
  CheckCircle2,
  ChevronRight,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { TENANT_CONFIG } from '../../shared/constants';

type PasoType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function GeneradorCertificados() {
  const [pasoActual, setPasoActual] = useState<PasoType>(1);

  // Estados de progreso
  const [plantillaDescargada, setPlantillaDescargada] = useState(false);
  const [plantillaSubida, setPlantillaSubida] = useState(false);
  const [datosSubidos, setDatosSubidos] = useState(false);
  const [textoConfigurado, setTextoConfigurado] = useState(false);
  const [logosSubidos, setLogosSubidos] = useState(false);
  const [firmasSeleccionadas, setFirmasSeleccionadas] = useState(false);

  // Datos del formulario
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [nombreCurso, setNombreCurso] = useState('');
  const [textoEstatico, setTextoEstatico] = useState('');
  const [generando, setGenerando] = useState(false);

  // Estado para logos institucionales
  const [logos, setLogos] = useState<Array<{
    id: number;
    nombre: string;
    archivo: File | null;
    preview: string | null;
  }>>([
    { id: 1, nombre: '', archivo: null, preview: null },
    { id: 2, nombre: '', archivo: null, preview: null },
    { id: 3, nombre: '', archivo: null, preview: null }
  ]);

  // Estado para firmas
  const [firmas, setFirmas] = useState<Array<{
    id: number;
    nombre: string;
    cargo: string;
    archivo: File | null;
    preview: string | null;
  }>>([
    { id: 1, nombre: '', cargo: '', archivo: null, preview: null },
    { id: 2, nombre: '', cargo: '', archivo: null, preview: null },
    { id: 3, nombre: '', cargo: '', archivo: null, preview: null }
  ]);

  const puedeAvanzarA = (paso: PasoType): boolean => {
    switch (paso) {
      case 1: return true;
      case 2: return plantillaDescargada && tipoDocumento !== '' && nombreCurso !== '';
      case 3: return plantillaSubida;
      case 4: return datosSubidos;
      case 5: return textoConfigurado;
      case 6: return logosSubidos;
      case 7: return firmasSeleccionadas;
      default: return false;
    }
  };

  const handleGenerarCertificados = () => {
    setGenerando(true);
    // Simular generación de certificados
    setTimeout(() => {
      setGenerando(false);
      alert('¡Certificados generados exitosamente! 🎉');
    }, 2000);
  };

  // Funciones para manejar logos
  const handleSubirLogo = (logoId: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const nuevosLogos = logos.map(l =>
        l.id === logoId
          ? { ...l, archivo: file, preview: reader.result as string }
          : l
      );
      setLogos(nuevosLogos);
      // Marcar como subido si hay al menos un logo
      if (nuevosLogos.some(l => l.archivo !== null)) {
        setLogosSubidos(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleActualizarLogo = (logoId: number, nombre: string) => {
    setLogos(prev => prev.map(l =>
      l.id === logoId ? { ...l, nombre } : l
    ));
  };

  const handleEliminarLogo = (logoId: number) => {
    const nuevosLogos = logos.map(l =>
      l.id === logoId
        ? { ...l, archivo: null, preview: null, nombre: '' }
        : l
    );
    setLogos(nuevosLogos);
    // Verificar si aún hay logos subidos
    if (!nuevosLogos.some(l => l.archivo !== null)) {
      setLogosSubidos(false);
    }
  };

  // Funciones para manejar firmas
  const handleSubirFirma = (firmaId: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFirmas(prev => prev.map(f =>
        f.id === firmaId
          ? { ...f, archivo: file, preview: reader.result as string }
          : f
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleActualizarFirma = (firmaId: number, campo: 'nombre' | 'cargo', valor: string) => {
    setFirmas(prev => prev.map(f =>
      f.id === firmaId ? { ...f, [campo]: valor } : f
    ));
  };

  const handleEliminarFirma = (firmaId: number) => {
    setFirmas(prev => prev.map(f =>
      f.id === firmaId
        ? { ...f, archivo: null, preview: null, nombre: '', cargo: '' }
        : f
    ));
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Crear Nuevo Lote de Certificados
          </h3>
          <p className="text-gray-500 text-sm font-medium">
            Proceso guiado paso a paso para generar certificados profesionales
          </p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 w-fit shadow-md">
          <p className="text-xs font-bold text-gray-700">Paso {pasoActual} de 7</p>
        </div>
      </div>

      {/* Indicadores de pasos mejorados */}
      <div className="relative mb-8">
        {/* Línea de progreso */}
        <div className="hidden lg:block absolute top-10 left-0 right-0 h-1 bg-gray-200 rounded-full mx-12">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((pasoActual - 1) / 6) * 100}%`,
              background: `linear-gradient(90deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
            }}
          />
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-7 gap-2 relative">
          <StepIndicator
            numero={1}
            titulo="Configurar"
            icono={<Download className="w-4 h-4" />}
            activo={pasoActual === 1}
            completado={plantillaDescargada}
            onClick={() => setPasoActual(1)}
            habilitado={true}
          />
          <StepIndicator
            numero={2}
            titulo="Plantilla"
            icono={<ImageIcon className="w-4 h-4" />}
            activo={pasoActual === 2}
            completado={plantillaSubida}
            onClick={() => puedeAvanzarA(2) && setPasoActual(2)}
            habilitado={puedeAvanzarA(2)}
          />
          <StepIndicator
            numero={3}
            titulo="Datos"
            icono={<FileSpreadsheet className="w-4 h-4" />}
            activo={pasoActual === 3}
            completado={datosSubidos}
            onClick={() => puedeAvanzarA(3) && setPasoActual(3)}
            habilitado={puedeAvanzarA(3)}
          />
          <StepIndicator
            numero={4}
            titulo="Texto"
            icono={<Type className="w-4 h-4" />}
            activo={pasoActual === 4}
            completado={textoConfigurado}
            onClick={() => puedeAvanzarA(4) && setPasoActual(4)}
            habilitado={puedeAvanzarA(4)}
          />
          <StepIndicator
            numero={5}
            titulo="Logos"
            icono={<ImageIcon className="w-4 h-4" />}
            activo={pasoActual === 5}
            completado={logosSubidos}
            onClick={() => puedeAvanzarA(5) && setPasoActual(5)}
            habilitado={puedeAvanzarA(5)}
          />
          <StepIndicator
            numero={6}
            titulo="Firmas"
            icono={<PenTool className="w-4 h-4" />}
            activo={pasoActual === 6}
            completado={firmasSeleccionadas}
            onClick={() => puedeAvanzarA(6) && setPasoActual(6)}
            habilitado={puedeAvanzarA(6)}
          />
          <StepIndicator
            numero={7}
            titulo="Generar"
            icono={<Eye className="w-4 h-4" />}
            activo={pasoActual === 7}
            completado={false}
            onClick={() => puedeAvanzarA(7) && setPasoActual(7)}
            habilitado={puedeAvanzarA(7)}
          />
        </div>
      </div>

      {/* Contenido de cada paso */}
      <div className="mt-8">
        {/* PASO 1: Configuración */}
        {pasoActual === 1 && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Paso 1: Configuración inicial
                  </h4>
                  <p className="text-xs text-gray-600">
                    Define el tipo de documento y el nombre del curso. Estos datos se aplicarán a todos los certificados.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-lg">
              <h4 className="font-bold text-gray-900 mb-6">Configuración del Lote</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={tipoDocumento}
                    onChange={(e) => setTipoDocumento(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{
                      '--tw-ring-color': TENANT_CONFIG.PRIMARY_COLOR
                    } as React.CSSProperties}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Certificado">Certificado</option>
                    <option value="Certificado de Participación">Certificado de Participación</option>
                    <option value="Certificado de Asistencia">Certificado de Asistencia</option>
                    <option value="Constancia">Constancia</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Curso <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nombreCurso}
                    onChange={(e) => setNombreCurso(e.target.value)}
                    placeholder="Ej: Marketing Digital Avanzado"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{
                      '--tw-ring-color': TENANT_CONFIG.PRIMARY_COLOR
                    } as React.CSSProperties}
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    setPlantillaDescargada(true);
                    alert('Plantilla Excel descargada ✓');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all font-medium text-sm shadow-lg"
                  style={{ backgroundColor: TENANT_CONFIG.PRIMARY_COLOR }}
                >
                  <Download className="w-4 h-4" />
                  Descargar Plantilla Excel
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!tipoDocumento || !nombreCurso) {
                    alert('Por favor complete todos los campos obligatorios');
                    return;
                  }
                  setPasoActual(2);
                }}
                disabled={!tipoDocumento || !nombreCurso || !plantillaDescargada}
                className="flex items-center gap-2 px-8 py-3 text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                style={{
                  background: !tipoDocumento || !nombreCurso || !plantillaDescargada
                    ? '#9ca3af'
                    : `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                }}
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: Subir Plantilla y Logos */}
        {pasoActual === 2 && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Paso 2: Plantilla de diseño y logos
                  </h4>
                  <p className="text-xs text-gray-600">
                    Sube la imagen de fondo que se usará para todos los certificados (PNG o JPG recomendado). 
                    Además, puedes agregar hasta 3 logos institucionales (opcional).
                  </p>
                </div>
              </div>
            </div>

            {/* Sección de plantilla */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-all shadow-lg">
              <Upload className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Subir Plantilla de Certificado</h4>
              <p className="text-sm text-gray-500 mb-6 font-medium">
                Medidas recomendadas: 1900 x 1345 píxeles (A4 horizontal)
              </p>
              <button
                onClick={() => {
                  setPlantillaSubida(true);
                  alert('Plantilla subida exitosamente ✓');
                }}
                style={{ backgroundColor: TENANT_CONFIG.PRIMARY_COLOR }}
                className="px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg"
              >
                Seleccionar Plantilla
              </button>
              {plantillaSubida && (
                <div className="mt-6 flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-semibold">Plantilla cargada correctamente</span>
                </div>
              )}
            </div>

            {/* Sección de logos */}
            <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-lg">
              <h4 className="font-bold text-gray-900 mb-6">Logos Institucionales (Opcional)</h4>
              <p className="text-sm text-gray-600 mb-6">
                Puedes subir hasta 3 logos. Recomendado formato PNG con fondo transparente.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {logos.map((logo) => (
                  <div key={logo.id} className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all">
                    <div className="mb-4">
                      <p className="text-sm font-bold text-gray-700 mb-3">Logo {logo.id}</p>

                      {/* Preview del logo */}
                      <div className="aspect-square bg-white rounded-xl mb-4 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                        {logo.preview ? (
                          <img 
                            src={logo.preview} 
                            alt={`Logo ${logo.id}`} 
                            className="max-w-full max-h-full object-contain p-4" 
                          />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-gray-300" />
                        )}
                      </div>

                      {/* Botones de acción */}
                      <div className="flex gap-2 mb-4">
                        <label className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleSubirLogo(logo.id, file);
                            }}
                          />
                          <span
                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg cursor-pointer hover:opacity-90 transition-all text-sm font-medium shadow-md w-full"
                            style={{ backgroundColor: TENANT_CONFIG.PRIMARY_COLOR }}
                          >
                            <Upload className="w-4 h-4" />
                            {logo.archivo ? 'Cambiar' : 'Subir Logo'}
                          </span>
                        </label>
                        {logo.archivo && (
                          <button
                            onClick={() => handleEliminarLogo(logo.id)}
                            className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium shadow-md"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Campo de nombre del logo */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Nombre del logo (opcional)
                        </label>
                        <input
                          type="text"
                          value={logo.nombre}
                          onChange={(e) => handleActualizarLogo(logo.id, e.target.value)}
                          placeholder="Ej: Logo Universidad"
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                          style={{
                            '--tw-ring-color': TENANT_CONFIG.PRIMARY_COLOR
                          } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Nota:</strong> Los logos son opcionales. Puedes subir de 1 a 3 logos. 
                    Si no necesitas logos, simplemente continúa al siguiente paso.
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setPasoActual(1)}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Atrás
              </button>
              <button
                onClick={() => setPasoActual(3)}
                disabled={!plantillaSubida}
                className="flex items-center gap-2 px-8 py-3 text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                style={{
                  background: !plantillaSubida
                    ? '#9ca3af'
                    : `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                }}
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: Subir Datos */}
        {pasoActual === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Paso 3: Datos de participantes
                  </h4>
                  <p className="text-xs text-gray-600">
                    Sube el archivo Excel con los datos de los participantes (usa la plantilla descargada en el Paso 1).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-10 text-center hover:border-gray-400 transition-colors">
              <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Subir Archivo Excel</h4>
              <p className="text-sm text-gray-500 mb-6">
                Formato .xlsx o .xls con los datos de los participantes
              </p>
              <button
                onClick={() => {
                  setDatosSubidos(true);
                  alert('Datos cargados: 25 participantes ✓');
                }}
                className="px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all font-medium shadow-lg"
                style={{ backgroundColor: TENANT_CONFIG.PRIMARY_COLOR }}
              >
                Seleccionar Excel
              </button>
              {datosSubidos && (
                <div className="mt-6">
                  <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">25 participantes cargados correctamente</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Nombres: Juan Pérez, María García, Carlos López...
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setPasoActual(2)}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Atrás
              </button>
              <button
                onClick={() => setPasoActual(4)}
                disabled={!datosSubidos}
                className="flex items-center gap-2 px-8 py-3 text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                style={{
                  background: !datosSubidos
                    ? '#9ca3af'
                    : `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                }}
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PASO 4: Texto Estático */}
        {pasoActual === 4 && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Paso 4: Texto personalizado (opcional)
                  </h4>
                  <p className="text-xs text-gray-600">
                    Agrega un texto que aparecerá en todos los certificados.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Texto Estático (Opcional)
              </label>
              <textarea
                value={textoEstatico}
                onChange={(e) => setTextoEstatico(e.target.value)}
                rows={4}
                placeholder="Por haber participado exitosamente en el curso..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                style={{
                  '--tw-ring-color': TENANT_CONFIG.PRIMARY_COLOR
                } as React.CSSProperties}
              />
              <p className="text-xs text-gray-500 mt-3">
                Este texto aparecerá en todos los certificados generados
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setPasoActual(3)}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Atrás
              </button>
              <button
                onClick={() => {
                  setTextoConfigurado(true);
                  setPasoActual(5);
                }}
                className="flex items-center gap-2 px-8 py-3 text-white rounded-xl font-medium transition-all hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                }}
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PASO 5: Firmas */}
        {pasoActual === 5 && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Paso 5: Firmas
                  </h4>
                  <p className="text-xs text-gray-600">
                    Sube las firmas de las personas que firmarán los certificados (formato PNG con fondo transparente recomendado).
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {firmas.map((firma) => (
                <div key={firma.id} className="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all">
                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-700 mb-3">Firma {firma.id}</p>

                    {/* Preview de la firma */}
                    <div className="aspect-video bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                      {firma.preview ? (
                        <img src={firma.preview} alt={`Firma ${firma.id}`} className="max-w-full max-h-full object-contain p-2" />
                      ) : (
                        <PenTool className="w-10 h-10 text-gray-300" />
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 mb-4">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleSubirFirma(firma.id, file);
                          }}
                        />
                        <span
                          className="flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg cursor-pointer hover:opacity-90 transition-all text-sm font-medium shadow-md w-full"
                          style={{ backgroundColor: TENANT_CONFIG.PRIMARY_COLOR }}
                        >
                          <Upload className="w-4 h-4" />
                          {firma.archivo ? 'Cambiar' : 'Subir Firma'}
                        </span>
                      </label>
                      {firma.archivo && (
                        <button
                          onClick={() => handleEliminarFirma(firma.id)}
                          className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium shadow-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Campos de información */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          value={firma.nombre}
                          onChange={(e) => handleActualizarFirma(firma.id, 'nombre', e.target.value)}
                          placeholder="Ej: Dr. Juan Pérez"
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                          style={{
                            '--tw-ring-color': TENANT_CONFIG.PRIMARY_COLOR
                          } as React.CSSProperties}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Cargo/Título
                        </label>
                        <input
                          type="text"
                          value={firma.cargo}
                          onChange={(e) => handleActualizarFirma(firma.id, 'cargo', e.target.value)}
                          placeholder="Ej: Director Académico"
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                          style={{
                            '--tw-ring-color': TENANT_CONFIG.PRIMARY_COLOR
                          } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs text-blue-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Tip:</strong> Puedes subir de 1 a 3 firmas. Si no necesitas usar las 3, simplemente deja las que no uses sin completar.
                </span>
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setPasoActual(4)}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Atrás
              </button>
              <button
                onClick={() => {
                  const tieneAlMenosUnaFirma = firmas.some(f => f.archivo !== null);
                  if (!tieneAlMenosUnaFirma) {
                    alert('Debes subir al menos una firma para continuar');
                    return;
                  }
                  setFirmasSeleccionadas(true);
                  setPasoActual(6);
                }}
                className="flex items-center gap-2 px-8 py-3 text-white rounded-xl font-medium transition-all hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                }}
              >
                Ver Previsualización
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PASO 6: Previsualización y Generar */}
        {pasoActual === 6 && (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-900 text-sm mb-1">
                    ¡Todo listo para generar!
                  </h4>
                  <p className="text-xs text-green-700">
                    Revisa el resumen y genera los certificados cuando estés listo.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
              <h4 className="font-semibold text-gray-900 mb-6 text-lg">📋 Resumen del Lote</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Tipo de documento</p>
                  <p className="text-base font-semibold text-gray-900">{tipoDocumento || 'No configurado'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Nombre del curso</p>
                  <p className="text-base font-semibold text-gray-900">{nombreCurso || 'No configurado'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Total de certificados</p>
                  <p className="text-3xl font-bold text-gray-900">25</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Logos cargados</p>
                  <p className="text-base font-semibold text-gray-900">
                    {logos.filter(l => l.archivo !== null).length} {logos.filter(l => l.archivo !== null).length === 1 ? 'logo' : 'logos'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Firmas cargadas</p>
                  <p className="text-base font-semibold text-gray-900">
                    {firmas.filter(f => f.archivo !== null).length} {firmas.filter(f => f.archivo !== null).length === 1 ? 'firma' : 'firmas'}
                  </p>
                </div>
              </div>

              {/* Mostrar logos cargados */}
              {logos.some(l => l.archivo !== null) && (
                <div className="mt-6">
                  <h5 className="text-sm font-bold text-gray-700 mb-4">Logos que aparecerán en los certificados:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {logos.filter(l => l.archivo !== null).map((logo) => (
                      <div key={logo.id} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                          {logo.preview && (
                            <img src={logo.preview} alt={logo.nombre || `Logo ${logo.id}`} className="max-w-full max-h-full object-contain p-4" />
                          )}
                        </div>
                        <p className="text-sm font-bold text-gray-900">{logo.nombre || `Logo ${logo.id}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mostrar firmas cargadas */}
              {firmas.some(f => f.archivo !== null) && (
                <div className="mt-6">
                  <h5 className="text-sm font-bold text-gray-700 mb-4">Firmas que aparecerán en los certificados:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {firmas.filter(f => f.archivo !== null).map((firma) => (
                      <div key={firma.id} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="aspect-video bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                          {firma.preview && (
                            <img src={firma.preview} alt={firma.nombre} className="max-w-full max-h-full object-contain p-2" />
                          )}
                        </div>
                        <p className="text-sm font-bold text-gray-900">{firma.nombre}</p>
                        <p className="text-xs text-gray-600">{firma.cargo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center py-10">
              <button
                onClick={handleGenerarCertificados}
                disabled={generando}
                className="px-16 py-5 text-white rounded-2xl hover:opacity-90 font-semibold shadow-xl transition-all text-lg transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center gap-3"
                style={{
                  background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                }}
              >
                {generando ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generando certificados...
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    Generar 25 Certificados
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-5">
                {generando
                  ? 'Por favor espera, esto puede tomar unos minutos...'
                  : 'Se generarán PDFs individuales con QR único para cada participante'
                }
              </p>
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => setPasoActual(5)}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Atrás
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para los indicadores de paso
function StepIndicator({
  numero,
  titulo,
  icono,
  activo,
  completado,
  onClick,
  habilitado,
}: {
  numero: number;
  titulo: string;
  icono: React.ReactNode;
  activo: boolean;
  completado: boolean;
  onClick: () => void;
  habilitado: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!habilitado}
      className={`relative rounded-3xl p-4 transition-all duration-300 ${
        activo
          ? 'shadow-2xl scale-110 transform'
          : completado
            ? 'bg-green-50 border border-green-200 shadow-lg'
            : habilitado
              ? 'bg-white border border-gray-200 shadow-md hover:shadow-xl hover:border-gray-300'
              : 'bg-gray-50 border border-gray-100 opacity-40 cursor-not-allowed'
      }`}
      style={
        activo
          ? {
              background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`,
              borderColor: 'transparent'
            }
          : undefined
      }
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center font-bold transition-all ${
            completado
              ? 'bg-green-500 text-white shadow-xl'
              : activo
                ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg'
                : habilitado
                  ? 'bg-gray-50 text-gray-600 shadow-sm'
                  : 'bg-gray-100 text-gray-400'
          }`}
        >
          {completado ? <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7" /> : icono}
        </div>
        <div className="text-center">
          <p
            className={`text-xs font-bold ${
              activo ? 'text-white' : completado ? 'text-green-700' : habilitado ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            {titulo}
          </p>
        </div>
      </div>
    </button>
  );
}