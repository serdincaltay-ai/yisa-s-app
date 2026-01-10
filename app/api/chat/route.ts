Dosya Tipi: ${fileType}

${message}

Patron bu dosyayı yükledi. İçeriği analiz et ve istenen işlemi yap.`
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }],
      messages: [{ role: 'user', content: enhancedMessage }],
    })

    const content = response.content[0]
    let text = content.type === 'text' ? content.text : ''

    return NextResponse.json({ message: text })
    return NextResponse.json({ 
      message: text,
      model: 'claude-sonnet-4',
      status: 'patron_mode_active'
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ message: 'Teknik sorun var Patron.' }, { status: 500 })
    return NextResponse.json({ 
      message: 'Teknik sorun var Patron. Hata detayı: ' + (error as Error).message 
    }, { status: 500 })
  }
}
