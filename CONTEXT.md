# Vaxa — Contexto del Proyecto

## ¿Qué es esto?
Plataforma SaaS multi-tenant. Cada empresa cliente tiene su propio portal con módulos independientes.
El módulo de certificados es el core del negocio actual.

---

## Estructura de URLs

```
localhost:5173/{empresa}/{modulo}
```

| URL | Descripción |
|-----|-------------|
| `/{empresa}/certificados/` | Formulario público — el alumno se inscribe sin login |
| `/{empresa}/certificados/validar` | Página pública — cualquiera valida un certificado por código |
| `/{empresa}/certificados/admin/login` | Login del operador de la empresa |
| `/{empresa}/certificados/admin` | Dashboard admin (requiere JWT) |
| `/{empresa}/certificados/admin/programas` | Gestión de programas |
| `/{empresa}/certificados/admin/grupos` | Grupos / secciones de cada programa |
| `/{empresa}/certificados/admin/inscripciones` | Inscripciones de alumnos + cambio de estado |
| `/{empresa}/certificados/admin/certificados` | Emisión y anulación de certificados |
| `/{empresa}/certificados/admin/config` | Logos, firmas y plantilla PDF por programa |

`{empresa}` es el `tenant_slug` que está en la tabla `empresas` de la BD.

---

## Arquitectura General

```
Frontend (React + Vite)  ←→  Backend (Express + MySQL)
        ↓
  lib/api/client.ts          src/index.ts (rutas)
  shared/api/*.ts            src/modules/certificados/
  shared/hooks/*.ts          src/modules/auth/
  modules/Admin*/index.tsx   src/middleware/
```

### Frontend — 3 capas (nunca mezclar)

```
1. API layer        → modules/certificados/shared/api/*.ts
                      Solo habla con el backend. Sin lógica de negocio.

2. Hooks layer      → modules/certificados/shared/hooks/*.ts
                      Estado, efectos, llamadas a la API. Sin JSX.

3. Components/Pages → modules/*/index.tsx
                      Solo UI. Sin fetch, sin lógica de negocio.
```

### Backend — Express por módulos

```
src/
├── index.ts                  Registro de rutas (orden importa)
├── middleware/
│   ├── jwt.middleware.ts     Verifica JWT en header Authorization
│   └── tenant.middleware.ts  Verifica x-tenant-id (solo rutas viejas)
├── modules/
│   ├── auth/                 Login — genera JWT 8h
│   └── certificados/
│       ├── shared/           DB helper + repositorio central
│       ├── public/           Rutas sin JWT (registro público)
│       ├── programas/        CRUD programas
│       ├── grupos/           CRUD grupos
│       ├── participantes/    CRUD participantes
│       ├── inscripciones/    CRUD + cambio de estado
│       ├── emision/          Generar / anular certificados
│       ├── logos/            Subir logos (base64)
│       ├── firmas/           Subir firmas (base64)
│       └── config/           Config PDF por programa
```

---

## Autenticación (JWT)

- **Login:** `POST /api/auth/login` con `{ correo, contrasena, empresa }`
- El backend valida el usuario en tabla `usuarios` JOIN `empresas` WHERE `tenant_slug = empresa`
- Devuelve `{ token, usuario }` — token dura 8 horas
- El frontend guarda el token en `localStorage` con key `vaxa_jwt_{empresa}`
- Cada request protegido envía `Authorization: Bearer {token}` + `x-tenant-id: {empresa}`

### Rutas del backend según protección

| Ruta | Auth requerida |
|------|---------------|
| `POST /api/auth/login` | ❌ Sin JWT, sin tenant middleware |
| `GET /public/certificados/:slug/*` | ❌ Sin JWT, sin tenant middleware |
| `* /api/certificados/*` | ✅ JWT requerido, tenant desde header x-tenant-id |
| `* /api/backoffice/*` | ✅ JWT requerido + tenant middleware (config en memoria) |

**Importante:** El módulo de certificados NO usa el `tenantMiddleware` de config en memoria.
Resuelve el tenant directamente desde la BD con `getEmpresaId(tenantSlug)`.

---

## Módulo de Certificados — Flujo completo

```
1. Alumno entra a /{empresa}/certificados/
   → Elige programa/grupo → llena sus datos → POST /public/certificados/{slug}/registro
   → Queda en estado INSCRITO (estado_id = 1)

2. Operador entra a /{empresa}/certificados/admin/login
   → JWT guardado → redirige al dashboard

3. Operador gestiona inscripciones:
   INSCRITO (1) → EN_CURSO (2) → APROBADO (3)
                                → DESAPROBADO (4)
              → RETIRADO (5)
   (estado_id 6 = RECHAZADO)

4. Con estado APROBADO (3) se puede emitir certificado:
   → POST /api/certificados/emision/generar/:inscripcionId
   → Genera código único, guarda en tabla certificados (estado_id = 1 = VIGENTE)

5. El PDF se genera en el FRONTEND (html2canvas + jsPDF):
   → Carga config del programa (logo, 2 firmas, plantilla)
   → Renderiza componente CertificadoPDF
   → Botón de descarga genera el PDF

6. Validación pública:
   → GET /public/certificado/:codigoUnico
   → Cualquiera puede verificar si es válido
```

---

## Base de Datos — Tablas clave

```sql
empresas          -- tenant_slug es el identificador único por empresa
usuarios          -- operadores/admins, tienen empresa_id
roles             -- admin, operador, etc.
tipos_documento   -- DNI, CE, pasaporte
tipos_programa    -- Curso, Taller, Diplomado, etc.
modalidades       -- Presencial, Virtual, Semipresencial
programas         -- Catálogo de cursos/talleres por empresa
grupos_programas  -- Secciones/turnos de cada programa
participantes     -- Alumnos (por empresa)
inscripciones     -- Alumno + grupo + estado
certificados      -- Emitidos, con código único
logos             -- Imágenes base64 para PDF
firmas            -- Imágenes base64 + nombre/cargo para PDF
config_certificados -- Config PDF por programa (logo, firmas, plantilla)
```

---

## Iconos (patrón del proyecto)

Todos los iconos van en un solo lugar:

```
components/ui/icon/lucide.ts   ← importar de lucide-react aquí
components/ui/icon/index.ts    ← re-exportar todo aquí
```

En los componentes: `import { NombreIcono } from '@/components/ui/icon'`

**Nunca** importar directo de `lucide-react` en componentes.

---

## Cómo correr el proyecto

### Backend
```bash
cd backend-vaxa-prod
npm run dev          # desarrollo (ts-node-dev, recarga automática)
npm run build        # compila TS → dist/
npm run start        # corre dist/index.js (producción)
```

> ⚠️ En desarrollo SIEMPRE usar `npm run dev`, no `npm run start`.
> `start` corre el JS compilado viejo, no el TypeScript actualizado.

### Frontend
```bash
cd frontend_vaxa_prod
npm run dev          # http://localhost:5173
```

### Variables de entorno

**Backend** (`backend-vaxa-prod/.env`):
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=admin
MYSQL_DATABASE=vaxa
PORT=4000
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=vaxa_secret_dev_change_in_prod
```

**Frontend** (`frontend_vaxa_prod/.env`):
```
VITE_API_URL=http://localhost:4000
```

---

## Credenciales de desarrollo

| Campo | Valor |
|-------|-------|
| URL login | `http://localhost:5173/vaxa/certificados/admin/login` |
| Correo | `admin@vaxasys.com` |
| Contraseña | `admin123` |
| Empresa (campo del form) | el `tenant_slug` de la tabla `empresas` donde `empresa_id = 1` |

---

## Tenants activos

El frontend tiene los tenants en `lib/tenants.ts`.
El backend YA NO requiere que el tenant esté en `tenants.config.ts` para certificados.
El módulo de certificados resuelve el tenant directo desde la BD (`empresas.tenant_slug`).

---

## Convenciones de código

- **Interfaces** en `shared/types/index.ts` — snake_case para coincidir con la BD
- **API layer** en `shared/api/*.ts` — solo fetch, sin estado
- **Hooks** en `shared/hooks/*.ts` — estado + efectos, sin JSX
- **Pages** en `modules/*/index.tsx` — solo UI, sin lógica
- **Comentarios**: solo cuando el WHY no es obvio
- **Español** para nombres de negocio, inglés para convenciones de código
