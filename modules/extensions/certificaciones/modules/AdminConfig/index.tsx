import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Settings, Upload, Trash2, Loader2, ImageIcon, FileSignature,
  CheckCircle, AlertCircle, Plus,
} from '@/components/ui/icon';
import { logosApi } from '../../shared/api/logos.api';
import { firmasApi } from '../../shared/api/firmas.api';
import type { Logo, Firma } from '../../shared/types';

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Sección Logos ─────────────────────────────────────────────────────────────
function SeccionLogos({ empresa }: { empresa: string }) {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logosApi.list(empresa).then(setLogos).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [empresa]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError(null);
    try {
      const base64 = await toBase64(file);
      const logo = await logosApi.create(empresa, { nombre: nombre || file.name, imagen_logo: base64 });
      setLogos(prev => [logo, ...prev]);
      setNombre('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este logo?')) return;
    try {
      await logosApi.delete(empresa, id);
      setLogos(prev => prev.filter(l => l.id !== id));
    } catch (e: unknown) { alert((e as Error).message); }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon size={16} className="text-indigo-600" />
        <h3 className="text-sm font-semibold text-gray-900">Logos</h3>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {/* Upload */}
      <div className="flex gap-2 mb-4">
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
          placeholder="Nombre del logo (opcional)"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <label className={`flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          Subir
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {loading && <div className="flex justify-center py-4 text-gray-400"><Loader2 size={18} className="animate-spin" /></div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {logos.map(logo => (
          <div key={logo.id} className="relative group border border-gray-200 rounded-lg overflow-hidden">
            <img src={logo.imagen_logo} alt={logo.nombre ?? 'logo'} className="w-full h-20 object-contain bg-gray-50 p-2" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => handleDelete(logo.id)}
                className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600">
                <Trash2 size={12} />
              </button>
            </div>
            {logo.nombre && (
              <p className="text-xs text-gray-500 px-2 py-1 truncate">{logo.nombre}</p>
            )}
          </div>
        ))}
      </div>

      {!loading && logos.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No hay logos subidos</p>
      )}
    </div>
  );
}

// ── Sección Firmas ────────────────────────────────────────────────────────────
function SeccionFirmas({ empresa }: { empresa: string }) {
  const [firmas, setFirmas] = useState<Firma[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre_autoridad: '', cargo: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firmasApi.list(empresa).then(setFirmas).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [empresa]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !form.nombre_autoridad || !form.cargo) {
      setError('Completa nombre y cargo antes de subir la firma');
      return;
    }
    setUploading(true); setError(null);
    try {
      const base64 = await toBase64(file);
      const firma = await firmasApi.create(empresa, { ...form, imagen_firma: base64 });
      setFirmas(prev => [firma, ...prev]);
      setForm({ nombre_autoridad: '', cargo: '' });
      setShowForm(false);
      if (fileRef.current) fileRef.current.value = '';
    } catch (e: unknown) { setError((e as Error).message); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta firma?')) return;
    try {
      await firmasApi.delete(empresa, id);
      setFirmas(prev => prev.filter(f => f.id !== id));
    } catch (e: unknown) { alert((e as Error).message); }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileSignature size={16} className="text-indigo-600" />
          <h3 className="text-sm font-semibold text-gray-900">Firmas</h3>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Plus size={12} /> Nueva
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {showForm && (
        <div className="border border-dashed border-indigo-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Nombre y apellido" value={form.nombre_autoridad}
              onChange={e => setForm(f => ({ ...f, nombre_autoridad: e.target.value }))}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="text" placeholder="Cargo" value={form.cargo}
              onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex gap-2">
            <label className={`flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer flex-1 justify-center transition-colors ${uploading ? 'opacity-50' : ''}`}>
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Subir imagen de firma
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            <button onClick={() => { setShowForm(false); setError(null); }}
              className="px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading && <div className="flex justify-center py-4 text-gray-400"><Loader2 size={18} className="animate-spin" /></div>}

      <div className="space-y-3">
        {firmas.map(firma => (
          <div key={firma.id} className="flex items-center gap-3 border border-gray-100 rounded-lg p-3">
            <img src={firma.imagen_firma} alt={firma.nombre_autoridad} className="h-10 w-24 object-contain bg-gray-50 rounded" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{firma.nombre_autoridad}</p>
              <p className="text-xs text-gray-500 truncate">{firma.cargo}</p>
            </div>
            <button onClick={() => handleDelete(firma.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {!loading && firmas.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No hay firmas registradas</p>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function AdminConfig() {
  const { empresa } = useParams<{ empresa: string }>();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Configuración</h1>
        <p className="text-sm text-gray-500">Gestiona logos, firmas y plantillas de certificados</p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex items-center gap-2">
        <CheckCircle size={16} className="text-indigo-600 flex-shrink-0" />
        <p className="text-xs text-indigo-800">
          Los logos y firmas que subas aquí estarán disponibles al configurar la plantilla de cada programa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SeccionLogos empresa={empresa!} />
        <SeccionFirmas empresa={empresa!} />
      </div>
    </div>
  );
}
