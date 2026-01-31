/**
 * YiSA-S Sporcu Takip Sistemi
 * Hareket havuzu, değerlendirme kriterleri, referans değerler
 */

import { getSupabase } from '@/lib/supabase'

// Branşlar
export const BRANCHES = {
  artistic_gymnastics: { name: 'Artistik Cimnastik', code: 'AG' },
  rhythmic_gymnastics: { name: 'Ritmik Cimnastik', code: 'RG' },
  trampoline: { name: 'Trampolin', code: 'TR' },
  aerobic: { name: 'Aerobik Cimnastik', code: 'AE' },
  acrobatic: { name: 'Akrobatik Cimnastik', code: 'AC' },
  parkour: { name: 'Parkur', code: 'PK' }
}

// Yaş Grupları
export const AGE_GROUPS = {
  mini: { name: 'Mini', minAge: 4, maxAge: 6 },
  children: { name: 'Çocuk', minAge: 7, maxAge: 9 },
  junior: { name: 'Genç', minAge: 10, maxAge: 12 },
  youth: { name: 'Yıldız', minAge: 13, maxAge: 15 },
  senior: { name: 'Büyük', minAge: 16, maxAge: 99 }
}

// Değerlendirme Kategorileri (0-5 puan)
export const EVALUATION_CATEGORIES = {
  strength: { name: 'Kuvvet', weight: 0.25 },
  flexibility: { name: 'Esneklik', weight: 0.25 },
  coordination: { name: 'Koordinasyon', weight: 0.20 },
  balance: { name: 'Denge', weight: 0.15 },
  endurance: { name: 'Dayanıklılık', weight: 0.15 }
}

// Referans Değer Tipleri
export const REFERENCE_TYPES = {
  world: { name: 'Dünya', level: 1 },
  country: { name: 'Türkiye', level: 2 },
  region: { name: 'Bölge', level: 3 },
  city: { name: 'Şehir', level: 4 },
  club: { name: 'Kulüp', level: 5 }
}

// Hareket Havuzu Interface
export interface Movement {
  id: string
  code: string
  name: string
  branch: keyof typeof BRANCHES
  difficulty: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  apparatus?: string
  prerequisites: string[]  // Önkoşul hareket ID'leri
  description: string
  videoUrl?: string
  evaluationCriteria: {
    category: keyof typeof EVALUATION_CATEGORIES
    minScore: number
  }[]
}

// Sporcu Profili
export interface Athlete {
  id: string
  tenant_id: string
  first_name: string
  last_name: string
  birth_date: string
  gender: 'male' | 'female'
  branch: keyof typeof BRANCHES
  age_group: keyof typeof AGE_GROUPS
  parent_id?: string
  coach_id?: string
  status: 'active' | 'inactive' | 'trial'
  level: number  // 1-10
  unlockedMovements: string[]
  created_at: string
}

// Değerlendirme
export interface Evaluation {
  id: string
  athlete_id: string
  evaluator_id: string
  date: string
  scores: {
    strength: number
    flexibility: number
    coordination: number
    balance: number
    endurance: number
  }
  totalScore: number
  notes?: string
  movementScores?: {
    movement_id: string
    score: number
    passed: boolean
  }[]
}

// Sporcu Oluştur
export async function createAthlete(params: {
  tenantId: string
  firstName: string
  lastName: string
  birthDate: string
  gender: 'male' | 'female'
  branch: keyof typeof BRANCHES
  parentId?: string
  coachId?: string
}) {
  const supabase = getSupabase()
  
  // Yaş grubunu hesapla
  const birthYear = new Date(params.birthDate).getFullYear()
  const currentYear = new Date().getFullYear()
  const age = currentYear - birthYear
  
  let ageGroup: keyof typeof AGE_GROUPS = 'mini'
  for (const [key, group] of Object.entries(AGE_GROUPS)) {
    if (age >= group.minAge && age <= group.maxAge) {
      ageGroup = key as keyof typeof AGE_GROUPS
      break
    }
  }
  
  const { data, error } = await supabase
    .from('athletes')
    .insert({
      tenant_id: params.tenantId,
      first_name: params.firstName,
      last_name: params.lastName,
      birth_date: params.birthDate,
      gender: params.gender,
      branch: params.branch,
      age_group: ageGroup,
      parent_id: params.parentId,
      coach_id: params.coachId,
      status: 'trial',
      level: 1,
      unlocked_movements: []
    })
    .select()
    .single()
  
  return { athlete: data, error }
}

// Değerlendirme Kaydet
export async function saveEvaluation(params: {
  athleteId: string
  evaluatorId: string
  scores: Evaluation['scores']
  notes?: string
  movementScores?: Evaluation['movementScores']
}) {
  const supabase = getSupabase()
  
  // Toplam skor hesapla (ağırlıklı ortalama)
  const totalScore = Object.entries(params.scores).reduce((sum, [key, score]) => {
    const weight = EVALUATION_CATEGORIES[key as keyof typeof EVALUATION_CATEGORIES]?.weight || 0
    return sum + (score * weight)
  }, 0)
  
  const { data, error } = await supabase
    .from('evaluations')
    .insert({
      athlete_id: params.athleteId,
      evaluator_id: params.evaluatorId,
      date: new Date().toISOString(),
      scores: params.scores,
      total_score: Math.round(totalScore * 100) / 100,
      notes: params.notes,
      movement_scores: params.movementScores
    })
    .select()
    .single()
  
  // Hareket kilidi açma kontrolü
  if (params.movementScores) {
    await checkMovementUnlocks(params.athleteId, params.movementScores)
  }
  
  return { evaluation: data, error }
}

// Hareket Kilidi Açma
async function checkMovementUnlocks(
  athleteId: string,
  movementScores: NonNullable<Evaluation['movementScores']>
) {
  const supabase = getSupabase()
  
  // Başarılı hareketleri al
  const passedMovements = movementScores
    .filter(m => m.passed)
    .map(m => m.movement_id)
  
  if (passedMovements.length === 0) return
  
  // Mevcut açık hareketleri al
  const { data: athlete } = await supabase
    .from('athletes')
    .select('unlocked_movements')
    .eq('id', athleteId)
    .single()
  
  const currentUnlocked = athlete?.unlocked_movements || []
  const newUnlocked = [...new Set([...currentUnlocked, ...passedMovements])]
  
  // Güncelle
  await supabase
    .from('athletes')
    .update({ unlocked_movements: newUnlocked })
    .eq('id', athleteId)
}

// Sporcu İstatistikleri
export async function getAthleteStats(athleteId: string) {
  const supabase = getSupabase()
  
  const { data: evaluations } = await supabase
    .from('evaluations')
    .select('total_score, date')
    .eq('athlete_id', athleteId)
    .order('date', { ascending: true })
  
  if (!evaluations || evaluations.length === 0) {
    return null
  }
  
  const latestScore = evaluations[evaluations.length - 1].total_score
  const firstScore = evaluations[0].total_score
  const improvement = latestScore - firstScore
  const averageScore = evaluations.reduce((sum, e) => sum + e.total_score, 0) / evaluations.length
  
  return {
    evaluationCount: evaluations.length,
    latestScore,
    firstScore,
    improvement,
    averageScore: Math.round(averageScore * 100) / 100,
    trend: improvement > 0 ? 'improving' : improvement < 0 ? 'declining' : 'stable'
  }
}

// Referans Karşılaştırma
export async function compareToReference(
  athleteId: string,
  referenceType: keyof typeof REFERENCE_TYPES
) {
  const supabase = getSupabase()
  
  // Sporcu bilgisi
  const { data: athlete } = await supabase
    .from('athletes')
    .select('age_group, branch')
    .eq('id', athleteId)
    .single()
  
  if (!athlete) return null
  
  // Son değerlendirme
  const { data: evaluation } = await supabase
    .from('evaluations')
    .select('total_score')
    .eq('athlete_id', athleteId)
    .order('date', { ascending: false })
    .limit(1)
    .single()
  
  if (!evaluation) return null
  
  // Referans değer (örnek - gerçek veriler DB'den gelmeli)
  const referenceScores: Record<string, number> = {
    world: 4.8,
    country: 4.2,
    region: 3.8,
    city: 3.5,
    club: 3.0
  }
  
  const reference = referenceScores[referenceType] || 3.0
  const percentage = (evaluation.total_score / reference) * 100
  
  return {
    athleteScore: evaluation.total_score,
    referenceScore: reference,
    referenceType,
    percentage: Math.round(percentage),
    status: percentage >= 100 ? 'above' : percentage >= 80 ? 'close' : 'below'
  }
}
