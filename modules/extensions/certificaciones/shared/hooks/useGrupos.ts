import { useState, useEffect, useCallback } from 'react';
import { gruposApi } from '../api/grupos.api';
import type { Grupo, CreateGrupoDto } from '../types';

export function useGrupos(empresa: string) {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gruposApi.list(empresa);
      setGrupos(data);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [empresa]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const create = async (data: CreateGrupoDto) => {
    const nuevo = await gruposApi.create(empresa, data);
    setGrupos(prev => [nuevo, ...prev]);
    return nuevo;
  };

  return { grupos, loading, error, create, refetch: fetchAll };
}
