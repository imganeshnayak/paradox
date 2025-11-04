import { NextRequest, NextResponse } from 'next/server'

/**
 * Translation API with multi-provider fallback
 * Primary: Open Router
 * Fallback 1: Google Gemini
 * Fallback 2: Hugging Face translation models
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
        targetLanguage,
        provider: 'none-needed'
      })
    }

    let translatedText: string | null = null
    let provider = 'unknown'

    // Try Open Router first (most reliable)
    const OPEN_ROUTER_KEY = process.env.OPEN_ROUTER_API_KEY || ''
    
    if (OPEN_ROUTER_KEY && !translatedText) {
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
          translatedText = result?.choices?.[0]?.message?.content?.trim() || null
          if (translatedText) {
            provider = 'open-router'
            console.log(`✅ Translation via Open Router: ${targetLanguage}`)
          }
        }
      } catch (openRouterError) {
        console.warn('Open Router translation failed, trying Gemini...', openRouterError)
      }
    }

    // Fallback to Gemini if Open Router fails
    if (!translatedText) {
      const GEMINI_KEY = process.env.GEMINI_API_KEY || ''
      if (GEMINI_KEY) {
        try {
          const translationPrompt = `Translate the following text to ${targetLanguage === 'es' ? 'Spanish' : targetLanguage === 'fr' ? 'French' : targetLanguage}. Only provide the translation, nothing else:\n\n${text}`
          
          const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      { text: translationPrompt },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 500,
                },
              }),
            }
          )

          if (geminiResponse.ok) {
            const geminiResult = await geminiResponse.json()
            translatedText = geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
            if (translatedText) {
              provider = 'gemini'
              console.log(`✅ Translation via Gemini: ${targetLanguage}`)
            }
          }
        } catch (geminiError) {
          console.warn('Gemini translation failed, trying Hugging Face...', geminiError)
        }
      }
    }

    // Fallback to Hugging Face
    if (!translatedText) {
      const HF_API_KEY = process.env.HF_TOKEN || process.env.HUGGING_FACE_API_KEY || ''
      
      // Map language codes to Helsinki-NLP models
      const modelMap: { [key: string]: string } = {
        'es': 'Helsinki-NLP/opus-mt-en-es',  // English to Spanish
        'fr': 'Helsinki-NLP/opus-mt-en-fr',  // English to French
      }

      const model = modelMap[targetLanguage]
      
      if (model && HF_API_KEY) {
        try {
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

          if (response.ok) {
            const result = await response.json()
            translatedText = result[0]?.translation_text || null
            if (translatedText) {
              provider = 'hugging-face'
              console.log(`✅ Translation via Hugging Face: ${targetLanguage}`)
            }
          }
        } catch (hfError) {
          console.warn('Hugging Face translation failed:', hfError)
        }
      }
    }

    // If all providers fail, return original text
    if (!translatedText) {
      translatedText = text
      provider = 'fallback'
      console.warn(`⚠️ All translation providers failed, returning original text`)
    }

    return NextResponse.json({
      translatedText,
      originalText: text,
      targetLanguage,
      provider
    })
  } catch (error) {
    console.error('Translation error:', error)
    
    // If all else fails, return original text
    const { text, targetLanguage } = await request.json()
    return NextResponse.json({
      translatedText: text,
      originalText: text,
      targetLanguage,
      provider: 'fallback',
      warning: 'Translation service unavailable, returning original text'
    }, { status: 200 })
  }
}
