import { useState, useEffect } from 'react';
import { catalogosApi } from '../api/catalogos.api';
import type { Catalogos } from '../types';

export function useCatalogos(empresa: string) {
  const [catalogos, setCatalogos] = useState<Catalogos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    catalogosApi.getAll(empresa)
      .then(setCatalogos)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [empresa]);

  return { catalogos, loading, error };
}
