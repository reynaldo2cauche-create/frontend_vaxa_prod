'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TenantConfig } from '@/lib/tenants';
import {
  Image as ImageIcon,
  FileSignature,
  Upload,
  Lock,
  Unlock,
  Palette,
  AlertTriangle,
  CheckCircle2,
  X,
} from 'lucide-react';
import Header from '@/components/shared/Header';
import { VAXA_CONFIG } from '../../shared/constants';
import { SISTEMAS_MOCK, CONFIGURACIONES_MOCK } from '../../shared/data/mockData';
import type { ConfiguracionSistema } from '../../shared/types';

interface ConfiguracionProps {
  tenantId: string;
  tenant: TenantConfig;
}

interface Usuario {
  email: string;
  nombre: string;
  role: string;
}

export default function Configuracion({ tenantId, tenant }: ConfiguracionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [selectedSistema, setSelectedSistema] = useState('1');
  const [config, setConfig] = useState<ConfiguracionSistema>(CONFIGURACIONES_MOCK[0]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'logo' | 'firma'>('logo');

  // Simular autenticación
  useState(() => {
    const authData = localStorage.getItem(`auth_${tenantId}`);
    const userData = localStorage.getItem(`auth_user_${tenantId}`);

    if (!authData || authData !== 'true') {
      router.push(`/${tenantId}/login`);
      return;
    }

    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUsuario(user);
      } catch (error) {
        router.push(`/${tenantId}/login`);
        return;
      }
    }

    setLoading(false);
  });

  if (loading || !usuario) {
    return null;
  }

  const sistema = SISTEMAS_MOCK.find((s) => s.id === selectedSistema);
  const logoEsBloqueado = config.logo.bloqueado;
  const firmasBloqueadas = config.firmas.every((f) => f.bloqueado);

  const handleUploadLogo = () => {
    setUploadType('logo');
    setShowUploadModal(true);
  };

  const handleUploadFirma = () => {
    setUploadType('firma');
    setShowUploadModal(true);
  };

  const handleSaveUpload = (url: string, metadata?: any) => {
    if (uploadType === 'logo') {
      setConfig({
        ...config,
        logo: {
          url,
          bloqueado: true,
          fechaBloqueo: new Date().toISOString().split('T')[0],
        },
      });
    } else {
      const newFirma = {
        id: `f${config.firmas.length + 1}`,
        nombre: metadata.nombre,
        cargo: metadata.cargo,
        url,
        bloqueado: true,
        fechaBloqueo: new Date().toISOString().split('T')[0],
      };
      setConfig({
        ...config,
        firmas: [...config.firmas, newFirma],
      });
    }
    setShowUploadModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        tenantId={tenantId}
        usuario={usuario}
        config={{
          name: VAXA_CONFIG.NAME,
          primaryColor: VAXA_CONFIG.PRIMARY_COLOR,
          secondaryColor: VAXA_CONFIG.SECONDARY_COLOR,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
          <p className="text-gray-600">Gestiona logos, firmas y personalización de sistemas</p>
        </div>

        {/* Selector de Sistema */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Seleccionar Sistema
          </label>
          <select
            value={selectedSistema}
            onChange={(e) => setSelectedSistema(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SISTEMAS_MOCK.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} ({s.slug})
              </option>
            ))}
          </select>
        </div>

        {/* Alerta de Seguridad */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-amber-900 mb-2">
              Importante: Restricción de Edición
            </h3>
            <p className="text-sm text-amber-800">
              Los logos y firmas solo pueden ser cargados <strong>una vez</strong>. Después de la
              carga inicial, quedarán <strong>bloqueados permanentemente</strong> para prevenir
              fraude en certificados. Asegúrate de subir los archivos correctos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Logo */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Logo del Sistema</h2>
                  <p className="text-sm text-gray-600">Aparece en certificados y documentos</p>
                </div>
              </div>
              {logoEsBloqueado ? (
                <Lock className="w-5 h-5 text-red-600" />
              ) : (
                <Unlock className="w-5 h-5 text-green-600" />
              )}
            </div>

            {config.logo.url ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center border-2 border-gray-200">
                  <img
                    src={config.logo.url}
                    alt="Logo"
                    className="max-h-32 object-contain"
                  />
                </div>

                {logoEsBloqueado ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-900">Logo bloqueado</p>
                      <p className="text-xs text-red-700 mt-1">
                        Bloqueado desde: {config.logo.fechaBloqueo}
                      </p>
                      <p className="text-xs text-red-700">
                        No se puede modificar por seguridad.
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleUploadLogo}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Reemplazar Logo (Se bloqueará después)
                  </button>
                )}
              </div>
            ) : (
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No hay logo cargado</p>
                  <button
                    onClick={handleUploadLogo}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Subir Logo
                  </button>
                </div>
                <p className="text-xs text-amber-600 mt-3 text-center font-medium">
                  ⚠️ Solo podrás subirlo una vez
                </p>
              </div>
            )}
          </div>

          {/* Colores */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Colores del Sistema</h2>
                <p className="text-sm text-gray-600">Personalización de marca</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color Primario
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.colores.primario}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        colores: { ...config.colores, primario: e.target.value },
                      })
                    }
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={config.colores.primario}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          colores: { ...config.colores, primario: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color Secundario
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.colores.secundario}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        colores: { ...config.colores, secundario: e.target.value },
                      })
                    }
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={config.colores.secundario}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          colores: { ...config.colores, secundario: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                Guardar Colores
              </button>
            </div>
          </div>
        </div>

        {/* Firmas */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileSignature className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Firmas Autorizadas</h2>
                <p className="text-sm text-gray-600">
                  Firmas que aparecerán en los certificados
                </p>
              </div>
            </div>
            <button
              onClick={handleUploadFirma}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Upload className="w-4 h-4" />
              Agregar Firma
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.firmas.map((firma) => (
              <div key={firma.id} className="border-2 border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{firma.nombre}</p>
                    <p className="text-sm text-gray-600">{firma.cargo}</p>
                  </div>
                  {firma.bloqueado && <Lock className="w-4 h-4 text-red-600" />}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center mb-3 border border-gray-200">
                  <img
                    src={firma.url}
                    alt={firma.nombre}
                    className="max-h-20 object-contain"
                  />
                </div>

                {firma.bloqueado && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-xs text-red-700 flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      Bloqueada desde: {firma.fechaBloqueo}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {config.firmas.length === 0 && (
              <div className="col-span-2 text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                <FileSignature className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No hay firmas registradas</p>
                <button
                  onClick={handleUploadFirma}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Agregar Primera Firma
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Upload */}
      {showUploadModal && (
        <UploadModal
          type={uploadType}
          onClose={() => setShowUploadModal(false)}
          onSave={handleSaveUpload}
        />
      )}
    </div>
  );
}

// Modal de Upload
function UploadModal({
  type,
  onClose,
  onSave,
}: {
  type: 'logo' | 'firma';
  onClose: () => void;
  onSave: (url: string, metadata?: any) => void;
}) {
  const [url, setUrl] = useState('');
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'logo') {
      onSave(url);
    } else {
      onSave(url, { nombre, cargo });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {type === 'logo' ? 'Subir Logo' : 'Agregar Firma'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Advertencia:</strong> Este archivo quedará bloqueado después de subirlo. No
              podrás modificarlo.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL de la imagen
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/ruta/al/archivo.png"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {type === 'firma' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Dr. Carlos Ruiz"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cargo</label>
                <input
                  type="text"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Director General"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Subir y Bloquear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
