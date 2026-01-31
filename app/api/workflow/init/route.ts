/**
 * WORKFLOW INIT API
 * 
 * POST /api/workflow/init - Sistemi baslat, baslangic gorevlerini yukle
 */

import { NextRequest, NextResponse } from 'next/server'
import { WorkflowEngine, TaskType } from '@/lib/workflow/engine'

// Baslangic Gorevleri - Her direktorluk icin
const INITIAL_TASKS: { type: TaskType; title: string; description: string; directorate: string }[] = [
  // CFO - Finans
  { type: 'finansal', title: 'Muhasebe Sistemi Sablon', description: 'Temel muhasebe raporlama sablonu olustur', directorate: 'CFO' },
  { type: 'finansal', title: 'Aidat Takip Tablosu', description: 'Franchise aidat takip excel sablonu', directorate: 'CFO' },
  
  // CTO - Teknoloji
  { type: 'teknik', title: 'API Dokumantasyonu', description: 'Tum API endpoint dokumantasyonu', directorate: 'CTO' },
  { type: 'teknik', title: 'Veritabani Yedekleme Proseduru', description: 'Otomatik yedekleme senaryosu', directorate: 'CTO' },
  
  // CMO - Pazarlama
  { type: 'icerik', title: 'Sosyal Medya Sablonlari', description: 'Instagram, Facebook, Twitter post sablonlari', directorate: 'CMO' },
  { type: 'icerik', title: 'E-posta Pazarlama Sablonu', description: 'Hosgeldin, aidat hatirlatma, etkinlik duyuru mailleri', directorate: 'CMO' },
  
  // CHRO - Insan Kaynaklari
  { type: 'belge', title: 'Personel Sozlesmesi', description: 'Standart is sozlesmesi sablonu', directorate: 'CHRO' },
  { type: 'belge', title: 'Performans Degerlendirme Formu', description: 'Calisanlarin aylik performans formu', directorate: 'CHRO' },
  
  // CLO - Hukuk
  { type: 'belge', title: 'KVKK Aydinlatma Metni', description: 'Kisisel veri isleme aydinlatma metni', directorate: 'CLO' },
  { type: 'belge', title: 'Franchise Sozlesmesi', description: 'Yeni franchise icin standart sozlesme', directorate: 'CLO' },
  
  // CSO - Satis
  { type: 'sablon', title: 'Satis Sunumu', description: 'Franchise satis PowerPoint sunumu', directorate: 'CSO_SATIS' },
  { type: 'sablon', title: 'ROI Hesaplama Tablosu', description: 'Franchise yatirim getiri hesaplama', directorate: 'CSO_SATIS' },
  
  // CPO - Urun
  { type: 'sablon', title: 'Panel UI Tasarimi', description: 'Dashboard ana ekran tasarimi', directorate: 'CPO' },
  { type: 'sablon', title: 'Mobil Uygulama Wireframe', description: 'Veli/sporcu mobil uygulama tasarimi', directorate: 'CPO' },
  
  // CDO - Veri
  { type: 'rapor', title: 'Referans Deger Tablosu', description: 'Jimnastik yas grubu referans degerleri', directorate: 'CDO' },
  { type: 'grafik', title: 'Sporcu Ilerleme Grafigi', description: 'Zaman bazli ilerleme grafik sablonu', directorate: 'CDO' },
  
  // CSPO - Sportif
  { type: 'degerlendirme', title: 'Hareket Havuzu', description: '500+ jimnastik hareketi ve degerlendirme kriterleri', directorate: 'CSPO' },
  { type: 'degerlendirme', title: 'Antrenman Programi Sablonu', description: 'Haftalik antrenman program sablonu', directorate: 'CSPO' },
  
  // CMDO - Medya
  { type: 'grafik', title: 'Logo Varyasyonlari', description: 'YiSA-S logo cesitleri ve kullanim kilavuzu', directorate: 'CMDO' },
  { type: 'grafik', title: 'Sosyal Medya Grafik Sablonu', description: 'Post, story, banner boyutlarinda sablonlar', directorate: 'CMDO' },
  
  // CRDO - AR-GE
  { type: 'rapor', title: 'Rakip Analizi', description: 'Piyasadaki jimnastik yazilimlarinin analizi', directorate: 'CRDO' },
  { type: 'rapor', title: 'Yeni Ozellik Onerileri', description: 'Kullanici geri bildirimlerine gore ozellik listesi', directorate: 'CRDO' },
]

export async function POST(req: NextRequest) {
  const results: { title: string; taskId?: string; error?: string }[] = []
  
  try {
    const body = await req.json().catch(() => ({}))
    const { autoRun = false, directorates } = body
    
    // Filtreleme (opsiyonel)
    let tasksToCreate = INITIAL_TASKS
    if (directorates && Array.isArray(directorates)) {
      tasksToCreate = INITIAL_TASKS.filter(t => directorates.includes(t.directorate))
    }
    
    // Gorevleri olustur
    for (const task of tasksToCreate) {
      const { taskId, error } = await WorkflowEngine.createTask({
        type: task.type,
        title: task.title,
        description: task.description,
        createdBy: 'system_init',
        priority: 'normal',
        input: { directorate: task.directorate }
      })
      
      if (error) {
        results.push({ title: task.title, error })
        continue
      }
      
      results.push({ title: task.title, taskId })
      
      // Otomatik calistir
      if (autoRun && taskId) {
        await WorkflowEngine.runFullWorkflow(taskId)
      }
    }
    
    // Istatistik
    const success = results.filter(r => r.taskId).length
    const failed = results.filter(r => r.error).length
    
    return NextResponse.json({
      message: `${success} gorev olusturuldu, ${failed} hata`,
      total: results.length,
      success,
      failed,
      results,
      nextStep: autoRun ? 'Gorevler isleniyor, onay bekleyenler icin GET /api/workflow' : 'POST /api/workflow/run ile gorevleri calistir'
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}

// GET - Mevcut baslangic gorevlerini listele
export async function GET() {
  return NextResponse.json({
    availableTasks: INITIAL_TASKS,
    directorates: [...new Set(INITIAL_TASKS.map(t => t.directorate))],
    total: INITIAL_TASKS.length,
    usage: {
      initAll: 'POST /api/workflow/init',
      initWithAutoRun: 'POST /api/workflow/init { "autoRun": true }',
      initSpecific: 'POST /api/workflow/init { "directorates": ["CFO", "CTO"] }'
    }
  })
}
