'use client'

import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => <p className="p-8 text-gray-500">API dokümantasyonu yükleniyor...</p>,
})

/**
 * /api-docs — Swagger UI ile interaktif API dokümantasyonu.
 * OpenAPI spec'i /api/openapi endpoint'inden yüklenir.
 */
export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Yisa-S API Dokümantasyonu
        </h1>
        <p className="mb-6 text-gray-600">
          Tüm endpoint&apos;lerin detaylı açıklamaları, istek/yanıt şemaları ve örnek değerler.
        </p>
        <SwaggerUI url="/api/openapi" />
      </div>
    </div>
  )
}
