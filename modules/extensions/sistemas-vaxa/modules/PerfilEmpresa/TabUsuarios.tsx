'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, User, Mail, Loader2, AlertCircle, X } from '@/components/ui/icon';
import {
  creditosAdminApi, type EmpresaCreditos, type UsuarioEmpresa, type Rol,
} from '../../shared/api/creditos.admin.api';

interface TabUsuariosProps { empresa: EmpresaCreditos; }

export default function TabUsuarios({ empresa }: TabUsuariosProps) {
  const [usuarios, setUsuarios] = useState<UsuarioEmpresa[] | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // form
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rolId, setRolId] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      const [us, rs] = await Promise.all([
        creditosAdminApi.listUsuarios(empresa.id),
        creditosAdminApi.listRoles(),
      ]);
      setUsuarios(us); setRoles(rs);
      setRolId((prev) => (prev === '' && rs.length ? rs[0].id : prev));
    } catch (e) { setError((e as Error).message); }
  }, [empresa.id]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleAddUser = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!rolId) { setError('Selecciona un rol'); return; }
    setSaving(true); setError(null);
    try {
      const nuevo = await creditosAdminApi.crearUsuario(empresa.id, {
        nombres, apellidos, correo, contrasena, rol_id: Number(rolId),
      });
      setUsuarios((prev) => [...(prev ?? []), nuevo]);
      setNombres(''); setApellidos(''); setCorreo(''); setContrasena('');
      setShowModal(false);
    } catch (e) { setError((e as Error).message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Usuarios de la Empresa</h3>
          <p className="text-sm text-gray-600 mt-1">Operadores que acceden al panel de certificados de <b>{empresa.razon_social}</b></p>
        </div>
        <button onClick={() => { setShowModal(true); setError(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-sm">
          <Plus className="w-5 h-5" /> Agregar Usuario
        </button>
      </div>

      {error && !showModal && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {!usuarios ? (
          <div className="flex justify-center py-12 text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-900 mb-2">No hay usuarios registrados</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold">
              <Plus className="w-5 h-5" /> Agregar Primer Usuario
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Usuario</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rol</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{u.nombres} {u.apellidos}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{u.correo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">{u.rol}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${u.activo ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,14,18,0.45)' }} onMouseDown={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Agregar Usuario</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={nombres} onChange={(e) => setNombres(e.target.value)} placeholder="Nombres" required
                  className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input value={apellidos} onChange={(e) => setApellidos(e.target.value)} placeholder="Apellidos" required
                  className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo" required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Contraseña (mín. 6)" required
                  className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <select value={rolId} onChange={(e) => setRolId(Number(e.target.value))}
                  className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                </select>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">Cancelar</button>
                <button type="submit" disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Crear usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
