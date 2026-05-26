import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Layers, ClipboardList, FileBadge,
  Settings, LogOut, Menu, X, GraduationCap, ChevronLeft,
} from '@/components/ui/icon';
import { authStorage } from '@/lib/auth';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export default function AdminLayout() {
  const { empresa } = useParams<{ empresa: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = authStorage.getUser(empresa!);

  const base = `/${empresa}/certificados/admin`;

  const navItems: NavItem[] = [
    { to: `${base}`,              label: 'Dashboard',      icon: <LayoutDashboard size={18} /> },
    { to: `${base}/programas`,    label: 'Programas',      icon: <BookOpen size={18} /> },
    { to: `${base}/grupos`,       label: 'Grupos',         icon: <Layers size={18} /> },
    { to: `${base}/inscripciones`,label: 'Inscripciones',  icon: <ClipboardList size={18} /> },
    { to: `${base}/certificados`, label: 'Certificados',   icon: <FileBadge size={18} /> },
    { to: `${base}/config`,       label: 'Configuración',  icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    authStorage.clearSession(empresa!);
    navigate(`/${empresa}/certificados/admin/login`);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Certificados</p>
              <p className="text-xs text-gray-500 capitalize">{empresa}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === base}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Portal público */}
        <div className="px-3 pb-3">
          <a
            href={`/${empresa}/certificados`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <ChevronLeft size={14} />
            Ver portal público
          </a>
        </div>

        {/* Usuario */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user ? `${user.nombres} ${user.apellidos}` : 'Operador'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.rol}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar móvil */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-900">Panel Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
