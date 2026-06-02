import { Building2, Search } from '@/components/ui/icon';

/** Pantalla 404 cuando el tenant_slug de la URL no existe en la BD. */
export default function EmpresaNotFound({ empresa }: { empresa: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0D0E12' }}>
      <div
        className="w-full max-w-[440px] rounded-2xl p-9 text-center"
        style={{ background: '#15161C', border: '1px solid rgba(253,230,138,0.12)' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)' }}
        >
          <Building2 size={30} style={{ color: '#94A3B8' }} />
        </div>

        <h1 className="text-[24px] font-bold tracking-tight" style={{ color: '#F8FAFC' }}>
          Empresa no encontrada
        </h1>

        <p className="text-[14px] leading-relaxed mt-3" style={{ color: '#94A3B8' }}>
          No existe ninguna empresa con el identificador{' '}
          <span className="font-semibold" style={{ color: '#FCD34D' }}>"{empresa}"</span>.
          Verifica la dirección.
        </p>

        <div
          className="flex items-center justify-center gap-2 mt-8 px-4 py-3 rounded-xl text-[12px]"
          style={{ background: 'rgba(148,163,184,0.06)', color: '#64748B' }}
        >
          <Search size={13} />
          <code style={{ color: '#94A3B8' }}>/{empresa}/certificados</code>
        </div>
      </div>
    </div>
  );
}
