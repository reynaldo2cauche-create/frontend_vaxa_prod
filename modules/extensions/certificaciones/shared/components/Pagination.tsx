import { ChevronLeft, ChevronRight } from '@/components/ui/icon';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
  total: number;
  /** Etiqueta del tipo de elemento, ej. "programas", "inscripciones" */
  itemLabel?: string;
  /** Color de acento para la página activa (default: dark) */
  accentColor?: string;
}

/**
 * Barra de paginación reutilizable con estilo del sistema "Credencial".
 * No se renderiza si solo hay una página.
 */
export default function Pagination({
  page,
  totalPages,
  onChange,
  startIndex,
  endIndex,
  total,
  itemLabel = 'registros',
  accentColor = '#0D0E12',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Ventana de hasta 5 botones numéricos centrada en la página actual.
  const numeros = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  const navBtn =
    'flex items-center justify-center h-8 px-2.5 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div
      className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between flex-wrap gap-3"
      style={{ border: '1px solid rgba(15,24,41,0.07)' }}
    >
      <p className="text-[12px]" style={{ color: '#9CA3AF' }}>
        Mostrando{' '}
        <span className="font-semibold" style={{ color: '#374151' }}>
          {startIndex + 1}–{endIndex}
        </span>{' '}
        de{' '}
        <span className="font-semibold" style={{ color: '#374151' }}>
          {total}
        </span>{' '}
        {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className={navBtn}
          style={{ color: '#4B5563', border: '1px solid rgba(15,24,41,0.1)' }}
          aria-label="Página anterior"
        >
          <ChevronLeft size={15} />
        </button>

        {numeros.map(n => {
          const activo = n === page;
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              className="h-8 min-w-8 px-2 rounded-lg text-[12px] font-semibold transition-colors"
              style={
                activo
                  ? { background: accentColor, color: '#fff' }
                  : { color: '#4B5563', border: '1px solid rgba(15,24,41,0.1)' }
              }
            >
              {n}
            </button>
          );
        })}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className={navBtn}
          style={{ color: '#4B5563', border: '1px solid rgba(15,24,41,0.1)' }}
          aria-label="Página siguiente"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
