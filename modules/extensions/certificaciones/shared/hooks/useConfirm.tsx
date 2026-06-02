import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import ConfirmModal, { type ConfirmModalProps } from '../components/ConfirmModal';

export type ConfirmOptions = Omit<ConfirmModalProps, 'onConfirm' | 'onCancel'>;

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Provee la función `confirm()` basada en promesa a todo el árbol.
 * Reemplaza al window.confirm() nativo por un modal con estilo propio.
 *
 *   const confirm = useConfirm();
 *   if (!(await confirm({ title: '...', variant: 'danger' }))) return;
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>(options => {
    setOpts(options);
    return new Promise<boolean>(resolve => { resolver.current = resolve; });
  }, []);

  const close = (result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setOpts(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {opts && (
        <ConfirmModal {...opts} onConfirm={() => close(true)} onCancel={() => close(false)} />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm debe usarse dentro de <ConfirmProvider>');
  return ctx;
}
