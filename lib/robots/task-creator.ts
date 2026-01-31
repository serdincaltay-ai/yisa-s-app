/**
 * YiSA-S Robot Gorev Olusturucu
 * 12 Direktorluk icin otomatik gorev sablonlari
 */

import { getSupabase } from '@/lib/supabase'

// Gorev Tipleri
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low'
export type TaskStatus = 'queued' | 'running' | 'success' | 'fail' | 'cancelled' | 'dlq'
export type TaskFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface TaskTemplate {
  title: string
  description: string
  directorate: string
  priority: TaskPriority
  frequency: TaskFrequency
  estimatedTokens: number
  dependencies?: string[]
}

// 12 Direktorluk Baslangic Gorevleri
export const STARTUP_TASKS: Record<string, TaskTemplate[]> = {
  CFO: [
    {
      title: 'Muhasebe Sistemi Kurulumu',
      description: 'Gelir-gider takip sistemi, fatura sablonlari, aidat takip modulu',
      directorate: 'CFO',
      priority: 'critical',
      frequency: 'once',
      estimatedTokens: 5000
    },
    {
      title: 'Token Fiyatlandirma Tablosu',
      description: 'AI islemleri icin token maliyetleri ve franchise fiyatlandirmasi',
      directorate: 'CFO',
      priority: 'high',
      frequency: 'once',
      estimatedTokens: 2000
    },
    {
      title: 'Aylik Finansal Rapor Sablonu',
      description: 'Otomatik aylik gelir-gider ozeti ve kar-zarar analizi',
      directorate: 'CFO',
      priority: 'medium',
      frequency: 'monthly',
      estimatedTokens: 3000
    }
  ],
  
  CTO: [
    {
      title: 'Veritabani Sema Dogrulamasi',
      description: '17 tablo, RLS politikalari, trigger ve fonksiyonlarin kontrolu',
      directorate: 'CTO',
      priority: 'critical',
      frequency: 'once',
      estimatedTokens: 4000
    },
    {
      title: 'API Endpoint Dokumantasyonu',
      description: 'Tum API endpointleri icin Swagger/OpenAPI dokumantasyonu',
      directorate: 'CTO',
      priority: 'high',
      frequency: 'once',
      estimatedTokens: 6000
    },
    {
      title: 'Guvenlik Taramasi',
      description: 'Haftalik kod guvenlik taramasi ve zafiyet raporu',
      directorate: 'CTO',
      priority: 'high',
      frequency: 'weekly',
      estimatedTokens: 2000
    }
  ],
  
  CMO: [
    {
      title: 'Sosyal Medya Takvimi',
      description: 'Instagram, Facebook, Twitter icin aylik icerik plani',
      directorate: 'CMO',
      priority: 'high',
      frequency: 'monthly',
      estimatedTokens: 4000
    },
    {
      title: 'E-posta Sablon Seti',
      description: 'Hosgeldin, hatirlatma, kampanya, bilgilendirme e-posta sablonlari',
      directorate: 'CMO',
      priority: 'medium',
      frequency: 'once',
      estimatedTokens: 3000
    },
    {
      title: 'Marka Kilavuzu',
      description: 'Logo kullanimi, renk paleti, tipografi ve gorsel standartlar',
      directorate: 'CMO',
      priority: 'medium',
      frequency: 'once',
      estimatedTokens: 2500
    }
  ],
  
  CHRO: [
    {
      title: 'Personel Rol Tanimlari',
      description: '13 rol icin gorev tanimlari, yetkiler ve sorumluluklar',
      directorate: 'CHRO',
      priority: 'critical',
      frequency: 'once',
      estimatedTokens: 5000
    },
    {
      title: 'Is Sozlesmesi Sablonlari',
      description: 'Tam zamanli, yari zamanli, stajyer sozlesme sablonlari',
      directorate: 'CHRO',
      priority: 'high',
      frequency: 'once',
      estimatedTokens: 4000
    },
    {
      title: 'Performans Degerlendirme Formu',
      description: 'Aylik/ceyreklik personel performans takip formu',
      directorate: 'CHRO',
      priority: 'medium',
      frequency: 'once',
      estimatedTokens: 2000
    }
  ],
  
  CLO: [
    {
      title: 'KVKK Uyum Dokumanlari',
      description: 'Aydinlatma metni, acik riza formu, veri isleme sozlesmesi',
      directorate: 'CLO',
      priority: 'critical',
      frequency: 'once',
      estimatedTokens: 6000
    },
    {
      title: 'Franchise Sozlesmesi',
      description: 'Ana franchise sozlesmesi ve ekleri (1500$ + token modeli)',
      directorate: 'CLO',
      priority: 'critical',
      frequency: 'once',
      estimatedTokens: 8000
    },
    {
      title: 'Veli Izin Belgeleri',
      description: 'Cocuk sporcu icin veli onam ve izin belge sablonlari',
      directorate: 'CLO',
      priority: 'high',
      frequency: 'once',
      estimatedTokens: 3000
    }
  ],
  
  CSO_SATIS: [
    {
      title: 'Satis Sunumu',
      description: 'Franchise adaylari icin YiSA-S tanitim sunumu',
      directorate: 'CSO_SATIS',
      priority: 'high',
      frequency: 'once',
      estimatedTokens: 4000
    },
    {
      title: 'ROI Hesaplama Araci',
      description: 'Franchise yatirim getirisi hesaplama modulu',
      directorate: 'CSO_SATIS',
      priority: 'medium',
      frequency: 'once',
      estimatedTokens: 3000
    },
    {
      title: 'CRM Entegrasyonu',
      description: 'Potansiyel musteri takip ve pipeline yonetimi',
      directorate: 'CSO_SATIS',
      priority: 'medium',
      frequency: 'once',
      estimatedTokens: 2000
    }
  ],
  
  CPO: [
    {
      title: 'Panel UI Tasarimi',
      description: 'Patron paneli ve franchise paneli UI/UX tasarimi',
      directorate: 'CPO',
      priority: 'high',
      frequency: 'once',
      estimatedTokens: 5000
    },
    {
      title: 'Mobil Uyumluluk',
      description: 'Responsive tasarim ve mobil optimizasyon',
      directorate: 'CPO',
      priority: 'medium',
      frequency: 'once',
      estimatedTokens: 3000
    },
    {
      title: 'Kullanici Arayuzu Testleri',
      description: 'Usability test senaryolari ve raporlama',
      directorate: 'CPO',
      priority: 'low',
      frequency: 'monthly',
      estimatedTokens: 2000
    }
  ],
  
  CDO: [
    {
      title: 'Referans Deger Tablosu',
      description: 'Sporcu referans degerleri (dunya, ulke, bolge ortalamalari)',
      directorate: 'CDO',
      priority: 'critical',
      frequency: 'once',
      estimatedTokens: 4000
    },
    {
      title: 'Grafik Sablon Seti',
      description: 'Sporcu gelisim grafikleri, karsilastirma chartlari',
      directorate: 'CDO',
      priority: 'high',
      frequency: 'once',
      estimatedTokens: 3000
    },
    {
      title: 'Veri Analiz Raporu',
      description: 'Haftalik sporcu performans analizi ve trend raporu',
      directorate: 'CDO',
      priority: 'medium',
      frequency: 'weekly',
      estimatedTokens: 2500
    }
  ],
  
  CSPO: [
    {
      title: 'Hareket Havuzu',
      description: 'Jimnastik hareketleri, zorluk seviyeleri, on kosullar',
      directorate: 'CSPO',
      priority: 'critical',
      frequency: 'once',
      estimatedTokens: 8000
    },
    {
      title: 'Yas Grubu Parametreleri',
      description: 'Yas grubuna gore antrenman suresi, yogunluk, tekrar sayilari',
      directorate: 'CSPO',
      priority: 'high',
      frequency: 'once',
      estimatedTokens: 4000
    },
    {
      title: 'Degerlendirme Kriterleri',
      description: 'Kuvvet, esneklik, koordinasyon puanlama sistemi (0-5)',
      directorate: 'CSPO',
      priority: 'high',
      frequency: 'once',
      estimatedTokens: 3000
    }
  ],
  
  CMDO: [
    {
      title: 'Video Sablon Seti',
      description: 'Tanitim, egitim, sosyal medya video sablonlari',
      directorate: 'CMDO',
      priority: 'medium',
      frequency: 'once',
      estimatedTokens: 4000
    },
    {
      title: 'Gorsel Tasarim Kiti',
      description: 'Instagram post, story, banner sablonlari',
      directorate: 'CMDO',
      priority: 'medium',
      frequency: 'once',
      estimatedTokens: 3000
    }
  ],
  
  CRDO: [
    {
      title: 'Rakip Analizi',
      description: 'Benzer sistemlerin analizi ve karsilastirmasi',
      directorate: 'CRDO',
      priority: 'medium',
      frequency: 'monthly',
      estimatedTokens: 5000
    },
    {
      title: 'Yeni Ozellik Onerileri',
      description: 'Kullanici geri bildirimleri ve gelistirme onerileri',
      directorate: 'CRDO',
      priority: 'low',
      frequency: 'monthly',
      estimatedTokens: 2000
    }
  ],
  
  CISO: [
    {
      title: 'Guvenlik Politikasi',
      description: 'Veri guvenligi, erisim kontrolu, sifre politikalari',
      directorate: 'CISO',
      priority: 'critical',
      frequency: 'once',
      estimatedTokens: 5000
    },
    {
      title: 'Olay Mudahale Plani',
      description: 'Guvenlik ihlali durumunda aksiyon plani',
      directorate: 'CISO',
      priority: 'high',
      frequency: 'once',
      estimatedTokens: 3000
    }
  ]
}

/**
 * Gorev olustur ve tasks tablosuna ekle
 */
export async function createTask(task: {
  title: string
  description: string
  directorate: string
  priority: TaskPriority
  assignedRobot?: string
  tenantId?: string
  metadata?: Record<string, unknown>
}): Promise<{ success: boolean; taskId?: string; error?: string }> {
  const supabase = getSupabase()
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: task.title,
      description: task.description,
      directorate: task.directorate,
      priority: task.priority,
      status: 'queued',
      assigned_robot: task.assignedRobot || 'ROB-CEO',
      tenant_id: task.tenantId,
      metadata: task.metadata || {},
      created_at: new Date().toISOString()
    })
    .select('id')
    .single()
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true, taskId: data.id }
}

/**
 * Direktorluk icin baslangic gorevlerini olustur
 */
export async function createStartupTasksForDirectorate(
  directorate: string,
  tenantId?: string
): Promise<{ success: boolean; createdCount: number; errors: string[] }> {
  const tasks = STARTUP_TASKS[directorate]
  if (!tasks) {
    return { success: false, createdCount: 0, errors: [`Directorate not found: ${directorate}`] }
  }
  
  const errors: string[] = []
  let createdCount = 0
  
  for (const task of tasks) {
    const result = await createTask({
      ...task,
      tenantId,
      metadata: {
        frequency: task.frequency,
        estimatedTokens: task.estimatedTokens,
        dependencies: task.dependencies
      }
    })
    
    if (result.success) {
      createdCount++
    } else {
      errors.push(`${task.title}: ${result.error}`)
    }
  }
  
  return {
    success: errors.length === 0,
    createdCount,
    errors
  }
}

/**
 * Tum direktorlukler icin baslangic gorevlerini olustur
 */
export async function createAllStartupTasks(
  tenantId?: string
): Promise<{ success: boolean; totalCreated: number; byDirectorate: Record<string, number>; errors: string[] }> {
  const byDirectorate: Record<string, number> = {}
  const allErrors: string[] = []
  let totalCreated = 0
  
  for (const directorate of Object.keys(STARTUP_TASKS)) {
    const result = await createStartupTasksForDirectorate(directorate, tenantId)
    byDirectorate[directorate] = result.createdCount
    totalCreated += result.createdCount
    allErrors.push(...result.errors)
  }
  
  return {
    success: allErrors.length === 0,
    totalCreated,
    byDirectorate,
    errors: allErrors
  }
}

export default {
  STARTUP_TASKS,
  createTask,
  createStartupTasksForDirectorate,
  createAllStartupTasks
}
