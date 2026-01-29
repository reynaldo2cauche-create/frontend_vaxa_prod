'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TenantConfig } from '@/lib/tenants';
import { Lock, Mail, Building2, Eye, EyeOff } from 'lucide-react';
import { VAXA_CONFIG } from '../../shared/constants';

interface LoginProps {
  tenantId: string;
  tenant: TenantConfig;
}

// Credenciales hardcodeadas para el admin de sistemas-vaxa
const ADMIN_CREDENTIALS = {
  email: 'admin@vaxa.com',
  password: 'admin123',
  nombre: 'Administrador',
  role: 'super-admin',
};

export default function VaxaLogin({ tenantId, tenant }: LoginProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Guardar auth en localStorage
      localStorage.setItem(`auth_${tenantId}`, 'true');
      localStorage.setItem(
        `auth_user_${tenantId}`,
        JSON.stringify({
          email: ADMIN_CREDENTIALS.email,
          nombre: ADMIN_CREDENTIALS.nombre,
          role: ADMIN_CREDENTIALS.role,
        })
      );

      // Redirigir al dashboard
      router.push(`/${tenantId}`);
    } else {
      setError('Credenciales incorrectas');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${VAXA_CONFIG.PRIMARY_COLOR}, ${VAXA_CONFIG.SECONDARY_COLOR})`,
            }}
          >
            <Building2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{VAXA_CONFIG.NAME}</h1>
          <p className="text-gray-600">Panel de Administración</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="admin@vaxa.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? '#94a3b8'
                  : `linear-gradient(135deg, ${VAXA_CONFIG.PRIMARY_COLOR}, ${VAXA_CONFIG.SECONDARY_COLOR})`,
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Credenciales de prueba */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-2">Credenciales de prueba:</p>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm font-mono text-gray-700">admin@vaxa.com</p>
              <p className="text-sm font-mono text-gray-700">admin123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          &copy; 2026 Sistemas Vaxa. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
