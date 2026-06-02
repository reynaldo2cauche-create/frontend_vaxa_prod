import { useState, useEffect, useCallback } from 'react';
import { creditosApi, type EstadoCreditos } from '../api/creditos.api';

/** Saldo de créditos de la empresa del operador. */
export function useCreditos(empresa: string) {
  const [estado, setEstado] = useState<EstadoCreditos | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      setEstado(await creditosApi.estado(empresa));
    } catch {
      setEstado(null);
    } finally {
      setLoading(false);
    }
  }, [empresa]);

  useEffect(() => { refetch(); }, [refetch]);

  return { estado, loading, refetch };
}
