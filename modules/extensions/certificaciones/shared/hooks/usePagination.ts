import { useState, useMemo, useEffect } from 'react';

/**
 * Paginación en cliente reutilizable.
 * Recibe el arreglo ya filtrado y devuelve el "slice" de la página actual.
 * Si los datos se reducen (ej. tras filtrar), ajusta la página para no quedar fuera de rango.
 */
export function usePagination<T>(items: T[], perPage = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  // Si la página actual quedó fuera de rango (filtro/eliminación), volver al máximo válido.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const startIndex = (page - 1) * perPage;

  const pageItems = useMemo(
    () => items.slice(startIndex, startIndex + perPage),
    [items, startIndex, perPage],
  );

  return {
    page,
    setPage,
    totalPages,
    pageItems,
    startIndex,
    endIndex: Math.min(startIndex + perPage, items.length),
    total: items.length,
  };
}
