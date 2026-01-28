'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Building2 } from 'lucide-react';
import { TENANT_CONFIG } from '../constants';
import { useState } from 'react';

interface HeaderProps {
  tenantId: string;
  usuario: {
    nombre: string;
    email: string;
    role: string;
  };
}

export default function Header({ tenantId, usuario }: HeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem(`auth_${tenantId}`);
    localStorage.removeItem(`auth_user_${tenantId}`);
    router.push(`/${tenantId}/login`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo y nombre */}
          <div className="flex items-center gap-4">
            {TENANT_CONFIG.LOGO ? (
              <Image
                src={TENANT_CONFIG.LOGO}
                alt={TENANT_CONFIG.NAME}
                width={48}
                height={48}
                className="rounded-2xl object-cover shadow-sm"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                }}
              >
                <Building2 className="w-6 h-6" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-gray-900">{TENANT_CONFIG.NAME}</h1>
              <p className="text-xs text-gray-500">Sistema de Certificados</p>
            </div>
          </div>

          {/* Usuario y menú */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{usuario.nombre}</p>
                <p className="text-xs text-gray-500">{usuario.email}</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold transition-all hover:shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
                  }}
                >
                  {usuario.nombre.charAt(0).toUpperCase()}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 py-1 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{usuario.nombre}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{usuario.email}</p>
                      <p className="text-xs font-medium mt-1" style={{ color: TENANT_CONFIG.PRIMARY_COLOR }}>{usuario.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:shadow-md"
              style={{
                background: `linear-gradient(135deg, ${TENANT_CONFIG.PRIMARY_COLOR}, ${TENANT_CONFIG.SECONDARY_COLOR})`
              }}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
