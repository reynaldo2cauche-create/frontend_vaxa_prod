const TOKEN_KEY = (empresa: string) => `vaxa_jwt_${empresa}`;
const USER_KEY  = (empresa: string) => `vaxa_user_${empresa}`;

export interface AuthUser {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: string;
  empresa: string;
}

export const authStorage = {
  getToken: (empresa: string): string | null =>
    localStorage.getItem(TOKEN_KEY(empresa)),

  setSession: (empresa: string, token: string, user: AuthUser): void => {
    localStorage.setItem(TOKEN_KEY(empresa), token);
    localStorage.setItem(USER_KEY(empresa), JSON.stringify(user));
  },

  getUser: (empresa: string): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY(empresa));
    if (!raw) return null;
    try { return JSON.parse(raw) as AuthUser; }
    catch { return null; }
  },

  clearSession: (empresa: string): void => {
    localStorage.removeItem(TOKEN_KEY(empresa));
    localStorage.removeItem(USER_KEY(empresa));
  },

  isAuthenticated: (empresa: string): boolean =>
    !!localStorage.getItem(TOKEN_KEY(empresa)),
};
