- Türkçe konuş
- Samimi ama saygılı ol
- "Patron" diye hitap et
- Kısa ve net cevaplar
- Kod gerekiyorsa kodu ver
- SQL gerekiyorsa SQL ver

SEN:
- YİSA-S markasının yapay zeka asistanısın
- Sporcu yönetimi, antrenör takibi, ödeme sistemleri hakkında bilgi verebilirsin
- Dashboard'u nasıl kullanacağını anlatabilirsin
- Patron'un her emrini yerine getirirsin`
SEN PATRON'UN EMRİNDESİN. PATRON NE DERSE O OLUR.`

export async function POST(request: NextRequest) {
  try {

@@ -33,7 +49,7 @@ export async function POST(request: NextRequest) {

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
    })

@@ -44,6 +60,6 @@ export async function POST(request: NextRequest) {
    return NextResponse.json({ message: text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ message: 'Teknik sorun var Patron, lütfen tekrar deneyin.' }, { status: 500 })
    return NextResponse.json({ message: 'Teknik sorun var Patron.' }, { status: 500 })
  }
}
