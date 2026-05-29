import { Routes, Route, Navigate } from 'react-router-dom';
import TenantLayout from './layouts/TenantLayout';
import HomePage from './pages/HomePage';
import TenantRedirect from './pages/TenantRedirect';
import LazyRoute from './components/LazyRoute';

// Módulo SaaS de Certificados (importación directa — no usa el module-loader)
import AdminGuard   from '../modules/extensions/certificaciones/shared/components/AdminGuard';
import AdminLayout  from '../modules/extensions/certificaciones/shared/components/AdminLayout';
import AdminLogin   from '../modules/extensions/certificaciones/modules/AdminLogin';
import AdminDashboard     from '../modules/extensions/certificaciones/modules/AdminDashboard';
import AdminProgramas     from '../modules/extensions/certificaciones/modules/AdminProgramas';
import AdminGrupos        from '../modules/extensions/certificaciones/modules/AdminGrupos';
import AdminInscripciones from '../modules/extensions/certificaciones/modules/AdminInscripciones';
import AdminEstudiantes   from '../modules/extensions/certificaciones/modules/AdminEstudiantes';
import AdminCertificados  from '../modules/extensions/certificaciones/modules/AdminCertificados';
import AdminConfig        from '../modules/extensions/certificaciones/modules/AdminConfig';
import PublicRegistro from '../modules/extensions/certificaciones/modules/PublicRegistro';
import PublicValidar  from '../modules/extensions/certificaciones/modules/PublicValidar';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* ── Módulo SaaS de Certificados ─────────────────────────────────────
          Rutas públicas y de admin para cualquier empresa cliente.
          URL: /:empresa/certificados/  (empresa = tenant_slug en la BD)
          ──────────────────────────────────────────────────────────────── */}
      <Route path="/:empresa/certificados">
        {/* Páginas públicas — sin autenticación */}
        <Route index element={<PublicRegistro />} />
        <Route path="validar" element={<PublicValidar />} />

        {/* Login del operador */}
        <Route path="admin/login" element={<AdminLogin />} />

        {/* Área protegida del operador */}
        <Route path="admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="programas"     element={<AdminProgramas />} />
            <Route path="grupos"        element={<AdminGrupos />} />
            <Route path="estudiantes"   element={<AdminEstudiantes />} />
            <Route path="inscripciones" element={<AdminInscripciones />} />
            <Route path="certificados"  element={<AdminCertificados />} />
            <Route path="config"        element={<AdminConfig />} />
          </Route>
        </Route>
      </Route>

      {/* ── Tenants existentes (module-loader) ──────────────────────────── */}
      <Route path="/:tenantId" element={<TenantLayout />}>
        <Route index element={<TenantRedirect />} />
        <Route path="login"       element={<LazyRoute module="Login" />} />
        <Route path="dashboard"   element={<LazyRoute module="Dashboard" />} />
        <Route path="participantes" element={<LazyRoute module="Participantes" />} />
        <Route path="historial"   element={<LazyRoute module="HistorialLotes" />} />
        <Route path="historial/:loteId/certificados" element={<LazyRoute module="Certificados" paramKey="loteId" />} />
        <Route path="validar"     element={<LazyRoute module="Validacion" />} />
        <Route path="sistemas"    element={<LazyRoute module="Sistemas" />} />
        <Route path="usuarios"    element={<LazyRoute module="UsuariosSistemasVaxa" />} />
        <Route path="certificaciones"                       element={<LazyRoute module="DashboardCertificaciones" />} />
        <Route path="certificaciones/empresas"              element={<LazyRoute module="EmpresasCertificaciones" />} />
        <Route path="certificaciones/registrar-empresa"     element={<LazyRoute module="RegistrarEmpresaCertificaciones" />} />
        <Route path="certificaciones/empresa/:empresaId"    element={<LazyRoute module="PerfilEmpresa" paramKey="empresaId" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
