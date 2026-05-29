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

/** Borra TODAS las sesiones de certificados guardadas (de cualquier empresa). */
function clearAllSessions(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && (k.startsWith('vaxa_jwt_') || k.startsWith('vaxa_user_'))) keys.push(k);
  }
  keys.forEach(k => localStorage.removeItem(k));
}

export const authStorage = {
  getToken: (empresa: string): string | null =>
    localStorage.getItem(TOKEN_KEY(empresa)),

  setSession: (empresa: string, token: string, user: AuthUser): void => {
    // Una sola sesión activa a la vez: al entrar a una empresa, se cierran
    // las sesiones de las demás. Evita sesiones huérfanas que darían acceso
    // a otra empresa solo por cambiar la URL.
    clearAllSessions();
    localStorage.setItem(TOKEN_KEY(empresa), token);
    localStorage.setItem(USER_KEY(empresa), JSON.stringify(user));
  },

  clearAllSessions,

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

  /** Devuelve la primera sesión activa de CUALQUIER empresa (o null). */
  findAnySession: (): { empresa: string; user: AuthUser | null } | null => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('vaxa_jwt_')) {
        const empresa = key.slice('vaxa_jwt_'.length);
        const raw = localStorage.getItem(USER_KEY(empresa));
        let user: AuthUser | null = null;
        if (raw) { try { user = JSON.parse(raw) as AuthUser; } catch { /* ignore */ } }
        return { empresa, user };
      }
    }
    return null;
  },
};
