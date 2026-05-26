import { api } from '@/lib/api/client';
import { authStorage } from '@/lib/auth';
import type { Catalogos } from '../types';

export const catalogosApi = {
  getAll: (empresa: string) =>
    api.get<Catalogos>('/api/certificados/catalogos', {
      tenantId: empresa,
      token: authStorage.getToken(empresa) ?? undefined,
    }),
};
