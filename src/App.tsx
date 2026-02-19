import { Routes, Route, Navigate } from 'react-router-dom';
import TenantLayout from './layouts/TenantLayout';
import HomePage from './pages/HomePage';
import TenantRedirect from './pages/TenantRedirect';
import LazyRoute from './components/LazyRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:tenantId" element={<TenantLayout />}>
        <Route index element={<TenantRedirect />} />
        <Route path="login" element={<LazyRoute module="Login" />} />
        <Route path="dashboard" element={<LazyRoute module="Dashboard" />} />
        <Route path="participantes" element={<LazyRoute module="Participantes" />} />
        <Route path="historial" element={<LazyRoute module="HistorialLotes" />} />
        <Route path="historial/:loteId/certificados" element={<LazyRoute module="Certificados" paramKey="loteId" />} />
        <Route path="validar" element={<LazyRoute module="Validacion" />} />
        <Route path="sistemas" element={<LazyRoute module="Sistemas" />} />
        <Route path="usuarios" element={<LazyRoute module="UsuariosSistemasVaxa" />} />
        <Route path="certificaciones" element={<LazyRoute module="DashboardCertificaciones" />} />
        <Route path="certificaciones/empresas" element={<LazyRoute module="EmpresasCertificaciones" />} />
        <Route path="certificaciones/registrar-empresa" element={<LazyRoute module="RegistrarEmpresaCertificaciones" />} />
        <Route path="certificaciones/empresa/:empresaId" element={<LazyRoute module="PerfilEmpresa" paramKey="empresaId" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

