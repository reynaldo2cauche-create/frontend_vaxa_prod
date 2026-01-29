'use client';

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Building2, History, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  tenantId: string;
  usuario: {
    nombre: string;
    email: string;
    role: string;
  };
  config?: {
    logo?: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
  };
}

export default function Header({ tenantId, usuario, config }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Valores por defecto si no se pasa config
  const tenantConfig = config || {
    name: tenantId,
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6'
  };

  const handleLogout = () => {
    localStorage.removeItem(`auth_${tenantId}`);
    localStorage.removeItem(`auth_user_${tenantId}`);
    router.push(`/${tenantId}/login`);
  };

  const handleNavigation = (path: string) => {
    router.push(`/${tenantId}${path}`);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const isActive = (path: string) => {
    return pathname?.includes(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo y nombre - Más compacto */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('/')}>
              {tenantConfig.logo ? (
                <Image
                  src={tenantConfig.logo}
                  alt={tenantConfig.name}
                  width={40}
                  height={40}
                  className="rounded-xl object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{
                    background: `linear-gradient(135deg, ${tenantConfig.primaryColor}, ${tenantConfig.secondaryColor})`
                  }}
                >
                  <Building2 className="w-5 h-5" />
                </div>
              )}
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-gray-900">{tenantConfig.name}</h1>
              </div>
            </div>

            {/* Centro - Navegación con estilo pill */}
            <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 rounded-full p-1">
              <button
                onClick={() => handleNavigation('/historial')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive('/historial')
                    ? 'text-white shadow-md font-bold'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm'
                }`}
                style={
                  isActive('/historial')
                    ? { backgroundColor: `${tenantConfig.primaryColor}60` }
                    : undefined
                }
              >
                <History className="w-4 h-4" />
                Historial
              </button>
              <button
                onClick={() => handleNavigation('/participantes')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  isActive('/participantes')
                    ? 'text-white shadow-md font-bold'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm'
                }`}
                style={
                  isActive('/participantes')
                    ? { backgroundColor: `${tenantConfig.primaryColor}60` }
                    : undefined
                }
              >
                <Users className="w-4 h-4" />
                Participantes
              </button>
            </nav>

            {/* Derecha - Usuario con badge */}
            <div className="flex items-center gap-3">
              {/* Desktop */}
              <div className="hidden md:block">
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-100 transition-all"
                  >
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{usuario.nombre}</p>
                      <p className="text-xs text-gray-500">{usuario.role}</p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${tenantConfig.primaryColor}, ${tenantConfig.secondaryColor})`
                      }}
                    >
                      {usuario.nombre.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-900">{usuario.nombre}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{usuario.email}</p>
                          <span 
                            className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{
                              background: `linear-gradient(135deg, ${tenantConfig.primaryColor}, ${tenantConfig.secondaryColor})`
                            }}
                          >
                            {usuario.role}
                          </span>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
          <div 
            className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              {/* Usuario info */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${tenantConfig.primaryColor}, ${tenantConfig.secondaryColor})`
                  }}
                >
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{usuario.nombre}</p>
                  <p className="text-xs text-gray-500">{usuario.email}</p>
                  <span 
                    className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${tenantConfig.primaryColor}, ${tenantConfig.secondaryColor})`
                    }}
                  >
                    {usuario.role}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <div className="space-y-1">
                <button
                  onClick={() => handleNavigation('/historial')}
                  className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <History className="w-5 h-5" />
                  Historial
                </button>
                <button
                  onClick={() => handleNavigation('/participantes')}
                  className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <Users className="w-5 h-5" />
                  Participantes
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-gray-200 mt-2 pt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}