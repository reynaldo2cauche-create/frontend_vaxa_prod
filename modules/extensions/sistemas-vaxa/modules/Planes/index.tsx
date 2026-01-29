'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TenantConfig } from '@/lib/tenants';
import {
  Package,
  Check,
  Users,
  FileText,
  Mail,
  Zap,
  Crown,
  TrendingUp,
} from 'lucide-react';
import Header from '@/components/shared/Header';
import { VAXA_CONFIG, PLANES } from '../../shared/constants';

interface PlanesProps {
  tenantId: string;
  tenant: TenantConfig;
}

interface Usuario {
  email: string;
  nombre: string;
  role: string;
}

export default function Planes({ tenantId, tenant }: PlanesProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Simular autenticación
  useState(() => {
    const authData = localStorage.getItem(`auth_${tenantId}`);
    const userData = localStorage.getItem(`auth_user_${tenantId}`);

    if (!authData || authData !== 'true') {
      router.push(`/${tenantId}/login`);
      return;
    }

    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUsuario(user);
      } catch (error) {
        router.push(`/${tenantId}/login`);
        return;
      }
    }

    setLoading(false);
  });

  if (loading || !usuario) {
    return null;
  }

  const planes = [
    {
      ...PLANES.BASICO,
      icon: Package,
      color: 'blue',
      popular: false,
    },
    {
      ...PLANES.PROFESIONAL,
      icon: TrendingUp,
      color: 'indigo',
      popular: true,
    },
    {
      ...PLANES.EMPRESARIAL,
      icon: Crown,
      color: 'purple',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        tenantId={tenantId}
        usuario={usuario}
        config={{
          name: VAXA_CONFIG.NAME,
          primaryColor: VAXA_CONFIG.PRIMARY_COLOR,
          secondaryColor: VAXA_CONFIG.SECONDARY_COLOR,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Planes y Precios</h1>
          <p className="text-xl text-gray-600">
            Elige el plan perfecto para las necesidades de tu negocio
          </p>
        </div>

        {/* Planes Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all hover:shadow-2xl ${
                plan.popular ? 'border-indigo-500 scale-105' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-sm font-bold">
                  MÁS POPULAR
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-${plan.color}-100 flex items-center justify-center`}
                  >
                    <plan.icon className={`w-7 h-7 text-${plan.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.nombre}</h3>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.precio.toFixed(2)}
                    </span>
                    <span className="text-gray-600">/mes</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Seleccionar Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparación detallada */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-8 py-6">
            <h2 className="text-2xl font-bold text-gray-900">Comparación Detallada</h2>
            <p className="text-gray-600 mt-2">Todas las características de cada plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-bold text-gray-900">
                    Característica
                  </th>
                  <th className="px-8 py-4 text-center text-sm font-bold text-gray-900">
                    Básico
                  </th>
                  <th className="px-8 py-4 text-center text-sm font-bold text-gray-900">
                    Profesional
                  </th>
                  <th className="px-8 py-4 text-center text-sm font-bold text-gray-900">
                    Empresarial
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-8 py-4 flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Usuarios</span>
                  </td>
                  <td className="px-8 py-4 text-center text-gray-700">
                    {PLANES.BASICO.usuarios}
                  </td>
                  <td className="px-8 py-4 text-center text-gray-700">
                    {PLANES.PROFESIONAL.usuarios}
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-purple-700 font-semibold">
                      <Crown className="w-4 h-4" />
                      Ilimitado
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-8 py-4 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Certificados/mes</span>
                  </td>
                  <td className="px-8 py-4 text-center text-gray-700">
                    {PLANES.BASICO.certificados}
                  </td>
                  <td className="px-8 py-4 text-center text-gray-700">
                    {PLANES.PROFESIONAL.certificados}
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-purple-700 font-semibold">
                      <Crown className="w-4 h-4" />
                      Ilimitado
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-8 py-4 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Soporte</span>
                  </td>
                  <td className="px-8 py-4 text-center text-gray-700">Email</td>
                  <td className="px-8 py-4 text-center text-gray-700">Prioritario</td>
                  <td className="px-8 py-4 text-center text-purple-700 font-semibold">24/7</td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-8 py-4 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">API Access</span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="px-8 py-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="px-8 py-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-8 py-4 flex items-center gap-3">
                    <Crown className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Personalización Avanzada</span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="px-8 py-4 text-center">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="px-8 py-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ o Info adicional */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            ¿Necesitas un plan personalizado para tu empresa?
          </p>
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg hover:shadow-xl">
            Contactar Ventas
          </button>
        </div>
      </main>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
