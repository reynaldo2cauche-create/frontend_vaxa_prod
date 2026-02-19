# Sistema Multi-Tenant Vaxa

Sistema web desarrollado con **Vite**, **React**, **React Router** y **Tailwind CSS**, con arquitectura multi-tenant modular. Pensado para desplegar como SPA estática (por ejemplo en cPanel) y soportar rutas dinámicas sin límite de IDs.

## 🏗️ Arquitectura

### Multi-Tenant Modular

- **Módulos core** (`modules/core/`): Componentes base compartidos.
- **Módulos por tenant** (`modules/extensions/{tenantId}/`): Cada tenant tiene sus propios módulos (Login, Dashboard, etc.).
- **Un solo build**: Una SPA; todas las rutas se resuelven en el cliente (ideal para hosting estático).
- **Config de tenants**: `lib/tenants.ts` define tenants y módulos habilitados.

### Estructura del Proyecto

```
/
├── src/                       # Aplicación Vite + React Router
│   ├── main.tsx               # Entrada
│   ├── App.tsx                # Rutas (/:tenantId/...)
│   ├── index.css              # Estilos globales (Tailwind)
│   ├── pages/                 # Páginas de rutas
│   │   ├── HomePage.tsx       # Selector de tenants (/)
│   │   └── TenantRedirect.tsx # Redirección por tenant
│   ├── layouts/
│   │   └── TenantLayout.tsx   # Layout por tenant
│   └── components/
│       ├── LazyRoute.tsx      # Carga módulos por ruta
│       └── AuthGuard.tsx      # Protección por sesión
│
├── modules/
│   ├── core/                  # Módulos base (Home, Pacientes, etc.)
│   └── extensions/            # Módulos por tenant
│       ├── certificaciones/   # Tenant Certificaciones
│       │   └── modules/      # Login, Dashboard, HistorialLotes, Certificados, etc.
│       └── sistemas-vaxa/    # Tenant Sistemas Vaxa
│           └── modules/       # Login, Sistemas, Usuarios, DashboardCertificaciones, etc.
│
├── components/                # Componentes compartidos
│   ├── ui/                    # Button, Input, Select, Card, iconos
│   └── shared/                # Header, PageTransition, DataTable
│
├── lib/
│   ├── tenants.ts             # Configuración de tenants
│   ├── module-loader.ts       # Carga dinámica de módulos (Vite glob)
│   └── api/                   # Cliente API (opcional)
│
├── public/                    # Assets estáticos
│   └── .htaccess              # SPA fallback para Apache/cPanel
│
├── index.html                 # Entrada HTML (Vite)
├── vite.config.ts             # Configuración Vite
└── package.json
```

## 🚀 Inicio rápido

### Requisitos

- Node.js 18+
- npm (o yarn/pnpm)

### Instalación

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd frontend_vaxa_prod
```

2. Instalar dependencias:
```bash
npm install
```

3. (Opcional) Variables de entorno  
   Si usas API, crea `.env` con algo como:
```env
VITE_API_URL=http://localhost:3001
```

4. Servidor de desarrollo:
```bash
npm run dev
```

5. Abrir en el navegador:
```
http://localhost:5173
```

### Build y despliegue (cPanel / estático)

```bash
npm run build
```

Se genera la carpeta **`dist/`**. Sube todo su contenido al hosting (incluido el `.htaccess` que se copia desde `public/`). El `.htaccess` está configurado para que todas las rutas sirvan `index.html` (SPA).

## 📖 Uso

### Acceder a un tenant

- **Página principal**: En la raíz (`/`) se listan los tenants; al hacer clic entras a ese tenant.
- **URL directa**:
  - Certificaciones: `http://localhost:5173/certificaciones` → redirige a login.
  - Sistemas Vaxa: `http://localhost:5173/sistemas-vaxa` → redirige a sistemas.

### Tenants disponibles

- **certificaciones**: Sistema de gestión de certificados (login, dashboard, historial, participantes, validación).
- **sistemas-vaxa**: Panel de administración (login, sistemas, usuarios, empresas, certificaciones).

### Añadir un nuevo tenant

1. En `lib/tenants.ts` agrega la configuración del tenant (id, name, modules, customModules, etc.).
2. Crea la carpeta `modules/extensions/{tenant-id}/modules/` y los módulos que necesites.
3. Las rutas `/:tenantId/...` funcionan automáticamente; no hace falta tocar `src/App.tsx` salvo que quieras rutas nuevas para ese tenant.

## 🔧 Desarrollo

### Crear un módulo para un tenant

1. Crear carpeta: `modules/extensions/{tenant-id}/modules/NombreModulo/`
2. Crear `index.tsx` que exporte por defecto un componente con props `tenantId` y `tenant`.
3. En `lib/tenants.ts`, añadir el nombre del módulo en `customModules` del tenant.
4. En `src/App.tsx`, añadir la ruta que use `<LazyRoute module="NombreModulo" />` (o con `paramKey` si lleva parámetro en la URL).

### Rutas dinámicas

Las rutas con parámetros (por ejemplo `/:tenantId/historial/:loteId/certificados`) funcionan para **cualquier** valor de `loteId` sin pregenerar páginas; el cliente lee el parámetro y llama al backend si hace falta.

## 🎨 Stack

- **Vite**: Build y dev server
- **React 18**: UI
- **React Router 6**: Rutas (incl. dinámicas por tenant)
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos

## 📝 Scripts

```bash
npm run dev      # Servidor de desarrollo (puerto 5173)
npm run build    # Build de producción → carpeta dist/
npm run preview  # Previsualizar el build localmente
npm run lint     # Linter
```

## 🔐 Variables de entorno

Con Vite se usan variables con prefijo `VITE_`:

```env
VITE_API_URL=http://localhost:3001
```

## 📚 Más

- [Cliente API](./lib/api/README.md) – si aplica
- [Componentes UI](./components/ui/README.md) – si aplica

## 📄 Licencia

[Tu licencia aquí]

---

**Sistema Vaxa – Multi-tenant con Vite + React**
