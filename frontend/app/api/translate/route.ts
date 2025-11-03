import { NextRequest, NextResponse } from 'next/server'

/**
 * Translation API using Open Router or Hugging Face translation models
 * Falls back gracefully if one provider fails
 */
export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      )
    }

    // If target language is English, return original text
    if (targetLanguage === 'en') {
      return NextResponse.json({
        translatedText: text,
        originalText: text,
        targetLanguage
      })
    }

    // Try Open Router first (most reliable)
    const OPEN_ROUTER_KEY = process.env.OPEN_ROUTER_API_KEY || ''
    
    if (OPEN_ROUTER_KEY) {
      try {
        const translationPrompt = `Translate the following text to ${targetLanguage === 'es' ? 'Spanish' : targetLanguage === 'fr' ? 'French' : targetLanguage}. Only provide the translation, nothing else:\n\n${text}`
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPEN_ROUTER_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Museum Translation',
          },
          body: JSON.stringify({
            model: 'openai/gpt-3.5-turbo',
            messages: [
              { role: 'user', content: translationPrompt },
            ],
            temperature: 0.3,
            max_tokens: 500,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          const translatedText = result?.choices?.[0]?.message?.content?.trim() || text
          console.log(`✅ Translation via Open Router: ${targetLanguage}`)
          
          return NextResponse.json({
            translatedText,
            originalText: text,
            targetLanguage,
            provider: 'open-router'
          })
        }
      } catch (openRouterError) {
        console.warn('Open Router translation failed, trying Hugging Face...', openRouterError)
      }
    }

    // Fallback to Hugging Face
    const HF_API_KEY = process.env.HF_TOKEN || process.env.HUGGING_FACE_API_KEY || ''
    
    // Map language codes to Helsinki-NLP models
    const modelMap: { [key: string]: string } = {
      'es': 'Helsinki-NLP/opus-mt-en-es',  // English to Spanish
      'fr': 'Helsinki-NLP/opus-mt-en-fr',  // English to French
    }

    const model = modelMap[targetLanguage]
    
    if (!model) {
      console.warn(`Unsupported target language: ${targetLanguage}`)
      return NextResponse.json({
        translatedText: text,
        originalText: text,
        targetLanguage,
        warning: 'Unsupported language, returning original text'
      })
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          options: { wait_for_model: true }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`)
    }

    const result = await response.json()
    const translatedText = result[0]?.translation_text || text
    console.log(`✅ Translation via Hugging Face: ${targetLanguage}`)

    return NextResponse.json({
      translatedText,
      originalText: text,
      targetLanguage,
      provider: 'hugging-face'
    })
  } catch (error) {
    console.error('Translation error:', error)
    
    // If all else fails, return original text
    const { text, targetLanguage } = await request.json()
    return NextResponse.json({
      translatedText: text,
      originalText: text,
      targetLanguage,
      warning: 'Translation service unavailable, returning original text'
    }, { status: 200 })
  }
}
