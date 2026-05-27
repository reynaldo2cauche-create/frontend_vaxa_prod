import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Layers, ClipboardList, FileBadge,
  Settings, LogOut, Menu, X, GraduationCap, Globe,
} from '@/components/ui/icon';
import { authStorage } from '@/lib/auth';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

export default function AdminLayout() {
  const { empresa } = useParams<{ empresa: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = authStorage.getUser(empresa!);

  const base = `/${empresa}/certificados/admin`;

  const navItems: NavItem[] = [
    { to: base,                    label: 'Dashboard',      icon: <LayoutDashboard size={16} />, end: true },
    { to: `${base}/programas`,     label: 'Programas',      icon: <BookOpen size={16} /> },
    { to: `${base}/grupos`,        label: 'Grupos',         icon: <Layers size={16} /> },
    { to: `${base}/inscripciones`, label: 'Inscripciones',  icon: <ClipboardList size={16} /> },
    { to: `${base}/certificados`,  label: 'Certificados',   icon: <FileBadge size={16} /> },
    { to: `${base}/config`,        label: 'Configuración',  icon: <Settings size={16} /> },
  ];

  const handleLogout = () => {
    authStorage.clearSession(empresa!);
    navigate(`/${empresa}/certificados/admin/login`);
  };

  const Sidebar = () => (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-30
      w-60 bg-[#0d0d10] flex flex-col
      transform transition-transform duration-200 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0">
            <GraduationCap size={14} className="text-white" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white leading-tight">Certificados</p>
            <p className="text-[11px] text-slate-500 capitalize leading-tight">{empresa}</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white transition-colors p-1">
          <X size={16} />
        </button>
      </div>

      <div className="mx-3 mb-3 h-px bg-white/[0.06]" />

      {/* Navegación */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white/[0.09] text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-indigo-400' : ''}>{item.icon}</span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Portal público */}
      <div className="px-2 pb-2">
        <a
          href={`/${empresa}/certificados`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all"
        >
          <Globe size={13} />
          Portal público
        </a>
      </div>

      <div className="mx-3 h-px bg-white/[0.06]" />

      {/* Usuario */}
      <div className="px-3 py-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-slate-200 truncate">
            {user ? `${user.nombres} ${user.apellidos}` : 'Operador'}
          </p>
          <p className="text-[11px] text-slate-500 truncate">{user?.rol ?? 'Admin'}</p>
        </div>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#f5f5f7] overflow-hidden">
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar móvil */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-black/[0.06]">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-800 transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-indigo-500" />
            <span className="text-sm font-semibold text-gray-900">Panel Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
