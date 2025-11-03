import { NextRequest, NextResponse } from 'next/server'

/**
 * AI Chatbot API using Open Router
 * Supports multiple models via Open Router's unified API
 * Free tier available at https://openrouter.ai
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

    const OPEN_ROUTER_KEY = process.env.OPEN_ROUTER_API_KEY || ''
    const MODEL = process.env.OPEN_ROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct'
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions'

    // Build the prompt
    const systemPrompt = 'You are an expert art historian and museum guide. Provide insightful, engaging, and accurate information about artworks.'
    const userPrompt = `Artwork Information:\n- Title: "${artwork.title}"\n- Artist: ${artwork.artist}\n- Year: ${artwork.year}\n- Medium: ${artwork.medium}\n- Period: ${artwork.period}\n- Description: ${artwork.description}\n- Story: ${artwork.story}\n\nVisitor Question: ${question}\n\nProvide a knowledgeable and engaging answer (2-4 sentences):`

    const response = await fetch(endpoint, {
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

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Open Router API error:', response.statusText, errorText)
      throw new Error(`Open Router API error: ${response.statusText}`)
    }

    const result = await response.json()
    let answer =
      result?.choices?.[0]?.message?.content?.trim() ||
      "I'm sorry, I couldn't generate a response."

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

    return NextResponse.json({ answer, question, language, model: MODEL })
  } catch (error) {
    console.error('AI Chat error:', error)
    const fallbackAnswers: Record<string, string> = {
      en: `I’m experiencing technical issues. Please try again shortly.`,
      es: `Lo siento, estoy experimentando dificultades técnicas. Inténtalo de nuevo pronto.`,
      fr: `Je rencontre des difficultés techniques. Veuillez réessayer plus tard.`,
    }
    return NextResponse.json(
      {
        answer: fallbackAnswers[language] || fallbackAnswers.en,
        error: 'Using fallback response',
      },
      { status: 200 }
    )
  }
}
