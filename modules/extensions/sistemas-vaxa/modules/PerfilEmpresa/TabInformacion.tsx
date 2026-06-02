'use client';

import { useState } from 'react';
import { Building2, FileText, Globe, CreditCard, Edit, Loader2, Upload, AlertCircle } from '@/components/ui/icon';
import { creditosAdminApi, type EmpresaCreditos } from '../../shared/api/creditos.admin.api';

interface TabInformacionProps { empresa: EmpresaCreditos; onChange?: () => void; }

export default function TabInformacion({ empresa, onChange }: TabInformacionProps) {
  const [editing, setEditing] = useState(false);
  const [razon, setRazon] = useState(empresa.razon_social);
  const [slug, setSlug] = useState(empresa.tenant_slug);
  const [dominio, setDominio] = useState(empresa.dominio ?? '');
  const [ruc, setRuc] = useState(empresa.ruc ?? '');
  const [activo, setActivo] = useState(empresa.activo === 1);
  const [logo, setLogo] = useState<string | null>(empresa.logo_url);  // base64/data URL
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setRazon(empresa.razon_social); setSlug(empresa.tenant_slug);
    setDominio(empresa.dominio ?? ''); setRuc(empresa.ruc ?? '');
    setActivo(empresa.activo === 1); setLogo(empresa.logo_url);
    setError(null); setEditing(false);
  };

  const onLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const guardar = async () => {
    setSaving(true); setError(null);
    try {
      await creditosAdminApi.editarEmpresa(empresa.id, {
        razon_social: razon,
        tenant_slug: slug,
        dominio,
        ruc,
        activo,
        logo: logo ?? '',          // '' borra el logo
      });
      onChange?.();
      setEditing(false);
    } catch (e) { setError((e as Error).message); }
    finally { setSaving(false); }
  };

  /* ── Modo edición ─────────────────────────────────────────── */
  if (editing) {
    return (
      <div className="space-y-5 max-w-2xl">
        <h3 className="text-lg font-bold text-gray-900">Editar empresa</h3>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Logo */}
        <div className="flex items-center gap-5">
          {logo ? (
            <img src={logo} alt="logo" className="w-20 h-20 rounded-xl object-contain border-2 border-gray-200" />
          ) : (
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
              <Building2 className="w-9 h-9 text-gray-400" />
            </div>
          )}
          <div className="flex gap-2">
            <label className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-400 cursor-pointer text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Subir logo
              <input type="file" accept="image/*" onChange={onLogoFile} className="hidden" />
            </label>
            {logo && <button onClick={() => setLogo(null)} className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl font-semibold">Quitar</button>}
          </div>
        </div>

        <Field label="Razón social"><input value={razon} onChange={(e) => setRazon(e.target.value)} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Identificador / slug (URL)">
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} />
            <p className="text-xs text-amber-600 mt-1">⚠ Cambiarlo cambia la URL y afecta los logins existentes</p>
          </Field>
          <Field label="Dominio"><input value={dominio} onChange={(e) => setDominio(e.target.value)} placeholder="techpro.edu.pe" className={inputCls} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="RUC"><input value={ruc} onChange={(e) => setRuc(e.target.value)} className={inputCls} /></Field>
          <Field label="Estado">
            <label className="flex items-center gap-2 mt-2.5 cursor-pointer">
              <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
              <span className="text-sm text-gray-700">{activo ? 'Activa' : 'Inactiva'}</span>
            </label>
          </Field>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button onClick={reset} className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl">Cancelar</button>
          <button onClick={guardar} disabled={saving} className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Guardar cambios
          </button>
        </div>
      </div>
    );
  }

  /* ── Modo vista ───────────────────────────────────────────── */
  const items = [
    { icon: Building2,  label: 'Razón social', value: empresa.razon_social },
    { icon: Globe,      label: 'Identificador (slug)', value: empresa.tenant_slug },
    { icon: Globe,      label: 'Dominio', value: empresa.dominio || '—' },
    { icon: FileText,   label: 'RUC', value: empresa.ruc || '—' },
    { icon: CreditCard, label: 'Créditos disponibles', value: String(empresa.creditos_disponibles) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Información de la empresa</h3>
        <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
          <Edit className="w-4 h-4" /> Editar
        </button>
      </div>

      {empresa.logo_url && (
        <img src={empresa.logo_url} alt="logo" className="w-20 h-20 rounded-xl object-contain border border-gray-200" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">{it.label}</p>
                <p className="font-semibold text-gray-900 truncate">{it.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400">
        Portal público: <code className="text-gray-600">/{empresa.tenant_slug}/certificados</code>
      </p>
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
