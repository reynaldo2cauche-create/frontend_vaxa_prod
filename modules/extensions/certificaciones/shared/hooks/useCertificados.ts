import { useState, useEffect, useCallback } from 'react';
import { certificadosApi } from '../api/certificados.api';
import type { Certificado, CertificadoPublico } from '../types';

export function useCertificados(empresa: string) {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await certificadosApi.list(empresa);
      setCertificados(data);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [empresa]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const generar = async (inscripcionId: number) => {
    const cert = await certificadosApi.generar(empresa, inscripcionId);
    setCertificados(prev => [cert, ...prev]);
    return cert;
  };

  const anular = async (id: number) => {
    const cert = await certificadosApi.anular(empresa, id);
    setCertificados(prev => prev.map(c => c.id === id ? cert : c));
    return cert;
  };

  return { certificados, loading, error, generar, anular, refetch: fetchAll };
}

export function useValidarCertificado() {
  const [resultado, setResultado] = useState<CertificadoPublico | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buscado, setBuscado] = useState(false);

  const validar = async (codigo: string) => {
    if (!codigo.trim()) return;
    setLoading(true);
    setError(null);
    setBuscado(true);
    try {
      const data = await certificadosApi.validar(codigo.trim().toUpperCase());
      setResultado(data);
    } catch {
      setResultado(null);
      setError('Certificado no encontrado o código inválido');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResultado(null); setError(null); setBuscado(false); };

  return { resultado, loading, error, buscado, validar, reset };
}
