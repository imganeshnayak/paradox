/**
 * Translation utility for artwork content
 * Uses browser's built-in translation or custom API
 */

interface TranslationCache {
  [key: string]: string
}

const translationCache: TranslationCache = {}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (targetLanguage === 'en') return text
  
  const cacheKey = `${text}_${targetLanguage}`
  if (translationCache[cacheKey]) {
    console.log(`[Translation] Cache hit for ${targetLanguage}`)
    return translationCache[cacheKey]
  }

  try {
    console.log(`[Translation] Requesting translation to ${targetLanguage}: "${text.substring(0, 50)}..."`)
    
    // Call backend translation API
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`[Translation] Success via ${data.provider || 'unknown'}: "${data.translatedText.substring(0, 50)}..."`)
      translationCache[cacheKey] = data.translatedText
      return data.translatedText
    } else {
      console.error(`[Translation] API error: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error('[Translation] Error:', error)
  }

  return text // Return original text if translation fails
}

export async function translateArtwork(artwork: any, targetLanguage: string) {
  if (targetLanguage === 'en') {
    console.log('[Translation] Target is English, returning original')
    return artwork
  }

  console.log(`[Translation] Starting artwork translation to ${targetLanguage}`)
  const translatedArtwork = { ...artwork }

  try {
    // Translate in parallel for better performance
    const [translatedTitle, translatedDescription, translatedStory] = await Promise.all([
      translateText(artwork.title, targetLanguage),
      translateText(artwork.description, targetLanguage),
      translateText(artwork.story, targetLanguage)
    ])

    translatedArtwork.title = translatedTitle
    translatedArtwork.description = translatedDescription
    translatedArtwork.story = translatedStory
    
    console.log(`[Translation] Artwork translation complete:`, {
      originalTitle: artwork.title,
      translatedTitle: translatedTitle,
      targetLanguage
    })
  } catch (error) {
    console.error('[Translation] Artwork translation error:', error)
  }

  return translatedArtwork
}
