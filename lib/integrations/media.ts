/**
 * YiSA-S Medya Entegrasyon Sistemi
 * Kaynak: yisa-s-medya-entegrasyon.md
 */

import { getSupabase } from '@/lib/supabase'

// Medya Servisleri
export const MEDIA_SERVICES = {
  FAL_AI: {
    name: 'Fal.ai',
    type: 'image_generation',
    endpoint: 'https://fal.ai/api',
    pricing: { per_image: 0.01 },
    capabilities: ['image_generation', 'image_editing', 'upscaling']
  },
  PIKA_LABS: {
    name: 'Pika Labs',
    type: 'video_generation',
    endpoint: 'https://pika.art/api',
    pricing: { per_video: 0.10 },
    capabilities: ['video_generation', 'video_editing']
  },
  CANVA: {
    name: 'Canva',
    type: 'design',
    endpoint: 'https://api.canva.com',
    pricing: { per_design: 0.00 },
    capabilities: ['templates', 'brand_kit', 'export']
  },
  TEMPLATED_IO: {
    name: 'Templated.io',
    type: 'template_generation',
    endpoint: 'https://api.templated.io',
    pricing: { per_render: 0.05 },
    capabilities: ['certificate', 'badge', 'report']
  },
  RENDERFOREST: {
    name: 'Renderforest',
    type: 'video_template',
    endpoint: 'https://api.renderforest.com',
    pricing: { per_video: 0.50 },
    capabilities: ['intro', 'slideshow', 'animation']
  }
}

// Medya Router - Görev tipine göre servis seçimi
export class MediaRouter {
  static selectService(taskType: string): keyof typeof MEDIA_SERVICES {
    const mapping: Record<string, keyof typeof MEDIA_SERVICES> = {
      // Görsel üretim
      'sporcu_grafik': 'FAL_AI',
      'sosyal_medya_gorsel': 'CANVA',
      'logo': 'FAL_AI',
      'banner': 'CANVA',
      
      // Video üretim
      'tanitim_video': 'PIKA_LABS',
      'intro': 'RENDERFOREST',
      'slideshow': 'RENDERFOREST',
      
      // Döküman üretim
      'sertifika': 'TEMPLATED_IO',
      'rozet': 'TEMPLATED_IO',
      'rapor_grafik': 'TEMPLATED_IO',
      'degerlendirme_karti': 'TEMPLATED_IO'
    }
    
    return mapping[taskType] || 'CANVA'
  }

  static async generateImage(prompt: string, options: {
    width?: number
    height?: number
    style?: string
  } = {}) {
    const supabase = getSupabase()
    
    // AI kullanım kaydı
    await supabase.from('ai_usage').insert({
      ai_service: 'fal_ai',
      operation_type: 'image_generation',
      input_tokens: prompt.length,
      output_tokens: 0,
      cost_usd: MEDIA_SERVICES.FAL_AI.pricing.per_image
    })

    // Fal.ai API çağrısı (gerçek implementasyon için API key gerekli)
    return {
      success: true,
      service: 'FAL_AI',
      prompt,
      options,
      // url: result.url
    }
  }

  static async generateCertificate(data: {
    studentName: string
    achievement: string
    date: string
    template: string
  }) {
    const supabase = getSupabase()
    
    await supabase.from('ai_usage').insert({
      ai_service: 'templated_io',
      operation_type: 'certificate_generation',
      cost_usd: MEDIA_SERVICES.TEMPLATED_IO.pricing.per_render
    })

    return {
      success: true,
      service: 'TEMPLATED_IO',
      data
    }
  }

  static async generateVideo(options: {
    type: 'intro' | 'slideshow' | 'promo'
    duration: number
    assets: string[]
  }) {
    const service = options.type === 'intro' ? 'RENDERFOREST' : 'PIKA_LABS'
    const supabase = getSupabase()
    
    await supabase.from('ai_usage').insert({
      ai_service: service.toLowerCase(),
      operation_type: 'video_generation',
      cost_usd: MEDIA_SERVICES[service].pricing.per_video
    })

    return {
      success: true,
      service,
      options
    }
  }
}

// Direktörlük bazlı medya erişimi
export const DIRECTORATE_MEDIA_ACCESS = {
  CMDO: ['FAL_AI', 'PIKA_LABS', 'CANVA', 'TEMPLATED_IO', 'RENDERFOREST'], // Medya - tam erişim
  CMO: ['CANVA', 'FAL_AI'], // Pazarlama - sosyal medya görselleri
  CDO: ['TEMPLATED_IO', 'FAL_AI'], // Veri - grafikler, raporlar
  CSPO: ['TEMPLATED_IO'], // Sportif - sertifikalar, rozetler
  CPO: ['CANVA', 'FAL_AI'], // Ürün - UI tasarımları
}
