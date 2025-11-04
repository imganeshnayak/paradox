import { NextRequest, NextResponse } from 'next/server'

/**
 * AI Chatbot API with multi-provider fallback
 * Primary: Open Router (openai/gpt-oss-20b)
 * Fallback: Google Gemini
 * Supports multiple models and languages
 */
export async function POST(request: NextRequest) {
  let language: string = 'en'

  try {
    const body = await request.json()
    const { question, artwork, language: reqLanguage } = body
    if (reqLanguage) language = reqLanguage

    if (!question || !artwork) {
      return NextResponse.json(
        { error: 'Question and artwork data are required' },
        { status: 400 }
      )
    }

    // Build the prompt
    const systemPrompt = 'You are an expert art historian and museum guide. Provide insightful, engaging, and accurate information about artworks.'
    const userPrompt = `Artwork Information:\n- Title: "${artwork.title}"\n- Artist: ${artwork.artist}\n- Year: ${artwork.year}\n- Medium: ${artwork.medium}\n- Period: ${artwork.period}\n- Description: ${artwork.description}\n- Story: ${artwork.story}\n\nVisitor Question: ${question}\n\nProvide a knowledgeable and engaging answer (2-4 sentences):`

    // Try Open Router first
    let answer: string | null = null
    let usedProvider = 'unknown'
    
    const OPEN_ROUTER_KEY = process.env.OPEN_ROUTER_API_KEY || ''
    if (OPEN_ROUTER_KEY) {
      try {
        const MODEL = process.env.OPEN_ROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct'
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPEN_ROUTER_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Museum AI Chatbot',
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          answer = result?.choices?.[0]?.message?.content?.trim() || null
          usedProvider = 'open-router'
          console.log('✅ Chat response from Open Router')
        } else {
          const errorText = await response.text()
          console.warn('Open Router API error:', response.statusText, errorText)
        }
      } catch (openRouterError) {
        console.warn('Open Router connection failed, trying Gemini...', openRouterError)
      }
    }

    // Fallback to Gemini if Open Router fails
    if (!answer) {
      const GEMINI_KEY = process.env.GEMINI_API_KEY || ''
      if (GEMINI_KEY) {
        try {
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
                      { text: `${systemPrompt}\n\n${userPrompt}` },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 300,
                },
              }),
            }
          )

          if (geminiResponse.ok) {
            const geminiResult = await geminiResponse.json()
            answer = geminiResult?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
            usedProvider = 'gemini'
            console.log('✅ Chat response from Gemini (fallback)')
          } else {
            const errorText = await geminiResponse.text()
            console.warn('Gemini API error:', geminiResponse.statusText, errorText)
          }
        } catch (geminiError) {
          console.warn('Gemini connection failed:', geminiError)
        }
      }
    }

    // Use fallback if both providers fail
    if (!answer) {
      answer = "I'm sorry, I couldn't generate a response."
      usedProvider = 'fallback'
    }

    // If language is not English, translate the response
    if (language !== 'en') {
      try {
        const translationResponse = await fetch(`${request.nextUrl.origin}/api/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: answer, targetLanguage: language }),
        })

        if (translationResponse.ok) {
          const translationData = await translationResponse.json()
          answer = translationData.translatedText || answer
          console.log(`Translated to ${language}:`, answer)
        } else {
          console.warn(`Translation failed for language ${language}`)
        }
      } catch (translationError) {
        console.error('Translation error:', translationError)
        // Continue with English response if translation fails
      }
    }

    return NextResponse.json({ answer, question, language, provider: usedProvider })
  } catch (error) {
    console.error('AI Chat error:', error)
    const fallbackAnswers: Record<string, string> = {
      en: `I'm experiencing technical issues. Please try again shortly.`,
      es: `Lo siento, estoy experimentando dificultades técnicas. Inténtalo de nuevo pronto.`,
      fr: `Je rencontre des difficultés techniques. Veuillez réessayer plus tard.`,
    }
    return NextResponse.json(
      {
        answer: fallbackAnswers[language] || fallbackAnswers.en,
        error: 'Using fallback response',
        provider: 'fallback'
      },
      { status: 200 }
    )
  }
}
