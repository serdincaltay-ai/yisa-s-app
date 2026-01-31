/**
 * YiSA-S AI Router (Yonlendirici) Sistemi
 * Gorev tipine ve direktorluge gore dogru AI'i secer
 */

// AI Servisleri
export type AIService = 'claude' | 'gpt' | 'gemini' | 'together' | 'v0' | 'cursor' | 'perplexity'

// AI Uzmanlik Alanlari
export const AI_EXPERTISE: Record<AIService, {
  name: string
  strengths: string[]
  costLevel: 'low' | 'medium' | 'high'
  speed: 'fast' | 'medium' | 'slow'
  bestFor: string[]
}> = {
  claude: {
    name: 'Claude (Anthropic)',
    strengths: ['karar_verme', 'analiz', 'strateji', 'metin_yazimi', 'kod_inceleme'],
    costLevel: 'high',
    speed: 'medium',
    bestFor: ['CEO kararları', 'Strateji analizi', 'Karmaşık problemler', 'Uzun metinler']
  },
  gpt: {
    name: 'GPT (OpenAI)',
    strengths: ['icerik_uretimi', 'yaratici_yazi', 'ceviri', 'ozetleme', 'sohbet'],
    costLevel: 'medium',
    speed: 'medium',
    bestFor: ['İçerik üretimi', 'Pazarlama metinleri', 'Sosyal medya', 'E-posta şablonları']
  },
  gemini: {
    name: 'Gemini (Google)',
    strengths: ['hizli_cevap', 'arama', 'multimodal', 'veri_analizi'],
    costLevel: 'low',
    speed: 'fast',
    bestFor: ['Hızlı sorgular', 'Basit sorular', 'Görsel analiz', 'Arama']
  },
  together: {
    name: 'Together AI',
    strengths: ['batch_islemler', 'ucuz_islemler', 'yuksek_hacim'],
    costLevel: 'low',
    speed: 'fast',
    bestFor: ['Toplu işlemler', 'Düşük öncelikli görevler', 'Batch processing']
  },
  v0: {
    name: 'v0 (Vercel)',
    strengths: ['ui_tasarim', 'react_komponenti', 'frontend'],
    costLevel: 'medium',
    speed: 'medium',
    bestFor: ['UI/UX tasarımı', 'React bileşenleri', 'Landing page']
  },
  cursor: {
    name: 'Cursor',
    strengths: ['kod_yazimi', 'debugging', 'refactoring', 'api_gelistirme'],
    costLevel: 'medium',
    speed: 'medium',
    bestFor: ['Kod yazımı', 'API geliştirme', 'Bug düzeltme', 'Refactoring']
  },
  perplexity: {
    name: 'Perplexity',
    strengths: ['arastirma', 'guncel_bilgi', 'kaynak_bulma'],
    costLevel: 'low',
    speed: 'fast',
    bestFor: ['Araştırma', 'Güncel bilgi', 'Kaynak bulma', 'Fact-checking']
  }
}

// Direktorluk bazli AI atamalari
export const DIRECTORATE_AI_MAP: Record<string, {
  primary: AIService
  secondary: AIService
  fallback: AIService
}> = {
  CFO: { primary: 'claude', secondary: 'gpt', fallback: 'gemini' },
  CTO: { primary: 'cursor', secondary: 'claude', fallback: 'gpt' },
  CIO: { primary: 'claude', secondary: 'perplexity', fallback: 'gpt' },
  CMO: { primary: 'gpt', secondary: 'gemini', fallback: 'together' },
  CHRO: { primary: 'gpt', secondary: 'claude', fallback: 'gemini' },
  CLO: { primary: 'claude', secondary: 'gpt', fallback: 'perplexity' },
  CSO_SATIS: { primary: 'gpt', secondary: 'claude', fallback: 'gemini' },
  CPO: { primary: 'v0', secondary: 'cursor', fallback: 'gpt' },
  CDO: { primary: 'claude', secondary: 'gpt', fallback: 'gemini' },
  CISO: { primary: 'claude', secondary: 'cursor', fallback: 'gpt' },
  CCO: { primary: 'gpt', secondary: 'gemini', fallback: 'together' },
  CSO_STRATEJI: { primary: 'claude', secondary: 'perplexity', fallback: 'gpt' },
  CMDO: { primary: 'gpt', secondary: 'together', fallback: 'gemini' }, // Medya
  CRDO: { primary: 'perplexity', secondary: 'claude', fallback: 'gpt' }, // AR-GE
  CSPO: { primary: 'claude', secondary: 'gpt', fallback: 'gemini' }, // Sportif
  CXO: { primary: 'v0', secondary: 'gpt', fallback: 'gemini' } // Deneyim
}

// Gorev tipi bazli AI secimi
export const TASK_TYPE_AI_MAP: Record<string, AIService> = {
  // Karar ve Strateji
  karar: 'claude',
  strateji: 'claude',
  analiz: 'claude',
  onay: 'claude',
  
  // Icerik Uretimi
  icerik: 'gpt',
  metin: 'gpt',
  eposta: 'gpt',
  sosyal_medya: 'gpt',
  pazarlama: 'gpt',
  
  // Hizli Islemler
  soru: 'gemini',
  arama: 'gemini',
  ceviri: 'gemini',
  
  // Kod ve Teknik
  kod: 'cursor',
  api: 'cursor',
  bug: 'cursor',
  
  // UI/UX
  tasarim: 'v0',
  ui: 'v0',
  komponenet: 'v0',
  
  // Arastirma
  arastirma: 'perplexity',
  kaynak: 'perplexity',
  
  // Batch/Ucuz
  batch: 'together',
  toplu: 'together'
}

// AI Router Ana Sinifi
export class AIRouter {
  
  /**
   * Gorev tipine gore AI sec
   */
  static selectByTaskType(taskType: string): AIService {
    const normalizedType = taskType.toLowerCase().replace(/\s+/g, '_')
    return TASK_TYPE_AI_MAP[normalizedType] || 'gpt' // Default: GPT
  }
  
  /**
   * Direktorluge gore AI sec
   */
  static selectByDirectorate(directorate: string): {
    primary: AIService
    secondary: AIService
    fallback: AIService
  } {
    const normalized = directorate.toUpperCase()
    return DIRECTORATE_AI_MAP[normalized] || {
      primary: 'gpt',
      secondary: 'claude',
      fallback: 'gemini'
    }
  }
  
  /**
   * Akilli AI secimi - gorev tipi + direktorluk + maliyet
   */
  static smartSelect(params: {
    taskType: string
    directorate?: string
    priority?: 'low' | 'medium' | 'high'
    budgetSensitive?: boolean
  }): AIService {
    const { taskType, directorate, priority = 'medium', budgetSensitive = false } = params
    
    // Yuksek oncelik + butce onemli degil = Claude
    if (priority === 'high' && !budgetSensitive) {
      return 'claude'
    }
    
    // Butce hassas = ucuz secenekler
    if (budgetSensitive) {
      const taskAI = this.selectByTaskType(taskType)
      const expertise = AI_EXPERTISE[taskAI]
      if (expertise.costLevel === 'high') {
        return 'gemini' // Ucuz alternatif
      }
      return taskAI
    }
    
    // Direktorluk varsa ona gore sec
    if (directorate) {
      const dirAI = this.selectByDirectorate(directorate)
      return dirAI.primary
    }
    
    // Varsayilan: gorev tipine gore
    return this.selectByTaskType(taskType)
  }
  
  /**
   * Fallback zinciri olustur
   */
  static getFallbackChain(primaryAI: AIService): AIService[] {
    const chains: Record<AIService, AIService[]> = {
      claude: ['gpt', 'gemini'],
      gpt: ['claude', 'gemini'],
      gemini: ['gpt', 'together'],
      together: ['gemini', 'gpt'],
      v0: ['cursor', 'gpt'],
      cursor: ['claude', 'gpt'],
      perplexity: ['gemini', 'gpt']
    }
    return [primaryAI, ...chains[primaryAI]]
  }
  
  /**
   * Token maliyeti hesapla (tahmini)
   */
  static estimateCost(ai: AIService, inputTokens: number, outputTokens: number): {
    costUSD: number
    costTRY: number
  } {
    const rates: Record<AIService, { input: number, output: number }> = {
      claude: { input: 0.008, output: 0.024 }, // per 1K tokens
      gpt: { input: 0.005, output: 0.015 },
      gemini: { input: 0.001, output: 0.002 },
      together: { input: 0.0005, output: 0.001 },
      v0: { input: 0.01, output: 0.03 },
      cursor: { input: 0.01, output: 0.03 },
      perplexity: { input: 0.001, output: 0.002 }
    }
    
    const rate = rates[ai]
    const costUSD = (inputTokens / 1000 * rate.input) + (outputTokens / 1000 * rate.output)
    const costTRY = costUSD * 35 // Ortalama kur
    
    return { costUSD, costTRY }
  }
}

export default AIRouter
