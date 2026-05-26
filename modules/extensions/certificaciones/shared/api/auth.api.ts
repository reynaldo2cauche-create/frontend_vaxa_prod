import { api } from '@/lib/api/client';
import type { AuthUser } from '@/lib/auth';

export interface LoginResponse {
  token: string;
  usuario: AuthUser;
}

export const authApi = {
  login: (empresa: string, correo: string, contrasena: string) =>
    api.post<LoginResponse>('/api/auth/login', { correo, contrasena, empresa }),
};
