// Sistema de carga dinámica de módulos (compatible con Vite)

import { getTenantConfig } from './tenants';

// Vite: glob para que el bundler incluya todos los módulos de extensions
const extensionModules = import.meta.glob<{ default: React.ComponentType<any> }>(
  '../modules/extensions/*/modules/*/index.tsx'
);
const coreModules = import.meta.glob<{ default: React.ComponentType<any> }>(
  '../modules/core/*/index.tsx'
);

interface ModuleProps {
  tenantId: string;
  tenant: any;
  [key: string]: any;
}

function findExtensionModule(tenantId: string, moduleName: string): (() => Promise<{ default: React.ComponentType<any> }>) | null {
  const key = Object.keys(extensionModules).find(
    (k) => k.includes(`/${tenantId}/`) && k.includes(`/${moduleName}/index.tsx`)
  );
  return key ? extensionModules[key] : null;
}

function findCoreModule(moduleName: string): (() => Promise<{ default: React.ComponentType<any> }>) | null {
  const key = Object.keys(coreModules).find((k) => k.includes(`/${moduleName}/index.tsx`));
  return key ? coreModules[key] : null;
}

export async function loadModule(
  moduleName: string,
  tenantId: string,
  _props?: ModuleProps
): Promise<React.ComponentType<any>> {
  const tenant = getTenantConfig(tenantId);

  if (!tenant) {
    throw new Error(`Tenant ${tenantId} no encontrado`);
  }

  if (moduleName !== 'Login') {
    const moduleKey = moduleName.toLowerCase() as keyof typeof tenant.modules;
    if (moduleKey in tenant.modules && tenant.modules[moduleKey] === false) {
      throw new Error(`Módulo ${moduleName} no habilitado para ${tenantId}`);
    }
  }

  const hasCustomModule = tenant.customModules?.includes(moduleName);

  if (hasCustomModule) {
    const loader = findExtensionModule(tenantId, moduleName);
    if (loader) {
      const mod = await loader();
      return mod.default;
    }
  }

  const coreLoader = findCoreModule(moduleName);
  if (coreLoader) {
    const mod = await coreLoader();
    return mod.default;
  }

  throw new Error(`Módulo ${moduleName} no encontrado`);
}

export function isModuleEnabled(moduleName: string, tenantId: string): boolean {
  const tenant = getTenantConfig(tenantId);
  if (!tenant) return false;
  const moduleKey = moduleName.toLowerCase() as keyof typeof tenant.modules;
  return tenant.modules[moduleKey] === true;
}
