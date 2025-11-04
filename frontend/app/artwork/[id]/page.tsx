"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArtworkHeader } from "@/components/artwork-detail/artwork-header"
import { RecommendedArtworks } from "@/components/artwork-detail/recommended-artworks"
import { FeedbackForm } from "@/components/artwork-detail/feedback-form"
import { LikeButton } from "@/components/artwork-detail/like-button"
import { ReviewsDisplay } from "@/components/artwork-detail/reviews-display"
import { Model3DViewer } from "@/components/artwork-detail/3d-model-viewer"
import { LanguageSelector } from "@/components/artwork-detail/language-selector"
import { ArtworkChatbot } from "@/components/artwork-detail/artwork-chatbot"
import { TextReader } from "@/components/artwork-detail/text-reader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Volume2, Play, Cuboid, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSessionId } from "@/lib/session-id"
import { translateArtwork } from "@/lib/translation"

interface Artwork {
  story: string
  _id: string
  title: string
  artist: string
  yearCreated: number
  description: string
  tags: string[]
  images: Array<{ url: string }>
  model3D?: { url: string; format: string }
  model3d?: { url: string; format: string }  // Handle both cases
  audio?: { url: string }
  video?: { url: string }
  medium?: string
  period?: string
}

export default function ArtworkDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("story")
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [translatedArtwork, setTranslatedArtwork] = useState<any>(null)

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
        
        const response = await fetch(`${backendUrl}/api/artworks/${id}`, {
          method: 'GET',
        })

        if (response.ok) {
          const data = await response.json()
          setArtwork(data)
          
          // Record artwork view in analytics
          recordArtworkView(id, backendUrl)
        } else {
          setArtwork(null)
        }
      } catch (error) {
        console.error('Failed to fetch artwork:', error)
        setArtwork(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArtwork()
    }
  }, [id])

  // Handle language change and translation
  useEffect(() => {
    const handleTranslation = async () => {
      if (!artwork) return

      const artData = {
        ...artwork,
        description: artwork.description,
        story: artwork.story || artwork.description,
        title: artwork.title
      }

      if (currentLanguage === 'en') {
        setTranslatedArtwork(null)
      } else {
        const translated = await translateArtwork(artData, currentLanguage)
        setTranslatedArtwork(translated)
      }
    }

    handleTranslation()
  }, [currentLanguage, artwork])

  // Record artwork view event
  const recordArtworkView = async (artworkId: string, backendUrl: string) => {
    try {
      const sessionId = getSessionId()
      const frontendUrl = typeof window !== 'undefined' ? window.location.origin : ''
      
      // Send to frontend proxy which will forward to backend
      const response = await fetch(`/api/analytics/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
          'X-Anonymous-Id': sessionId.substring(0, 8),
        },
        body: JSON.stringify({
          events: [
            {
              eventType: 'artwork_view',
              artworkId: artworkId,
              sessionId: sessionId,
              metadata: {
                timestamp: new Date(),
              }
            }
          ]
        })
      })

      if (response.ok) {
        console.log(`📊 Artwork view recorded for ${artworkId}`)
      } else {
        console.error(`Failed to record artwork view: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to record artwork view:', error)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-lg text-foreground/60">Loading artwork...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!artwork) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-lg text-foreground/60">Artwork not found</p>
        </div>
        <Footer />
      </>
    )
  }

  const artworkForDisplay = {
    id: artwork._id,
    title: translatedArtwork?.title || artwork.title,
    artist: artwork.artist,
    year: artwork.yearCreated,
    medium: artwork.medium || 'Unknown',
    period: artwork.period || 'Unknown',
    description: translatedArtwork?.description || artwork.description,
    story: translatedArtwork?.story || artwork.story || artwork.description,
    image: artwork.images?.[0]?.url || '/placeholder.svg',
    audioUrl: artwork.audio?.url,
    audioTranscript: `Listen to the audio guide for ${artwork.title} by ${artwork.artist}`,
    videoUrl: artwork.video?.url,
    model3D: artwork.model3D || artwork.model3d,  // Handle both uppercase and lowercase 'D'
    tags: artwork.tags || [],
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <ArtworkHeader artwork={artworkForDisplay} liked={liked} onLikeToggle={() => setLiked(!liked)} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Language Selector and Like Button */}
          <div className="mb-8 flex justify-between items-center">
            <LikeButton artworkId={artworkForDisplay.id} />
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
            />
          </div>
          {/* Tabbed Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab List */}
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-card border border-border rounded-lg p-1">
              <TabsTrigger
                value="story"
                className="flex items-center gap-2 data-[state=active]:bg-accent/20 rounded"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Story</span>
              </TabsTrigger>

              {artworkForDisplay.audioUrl && (
                <TabsTrigger
                  value="audio"
                  className="flex items-center gap-2 data-[state=active]:bg-accent/20 rounded"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Audio</span>
                </TabsTrigger>
              )}

              {artworkForDisplay.videoUrl && (
                <TabsTrigger
                  value="video"
                  className="flex items-center gap-2 data-[state=active]:bg-accent/20 rounded"
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Video</span>
                </TabsTrigger>
              )}

              {artworkForDisplay.model3D && (
                <TabsTrigger
                  value="3d"
                  className="flex items-center gap-2 data-[state=active]:bg-accent/20 rounded"
                >
                  <Cuboid className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">3D</span>
                </TabsTrigger>
              )}

              <TabsTrigger
                value="quiz"
                className="flex items-center gap-2 data-[state=active]:bg-accent/20 rounded"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Quiz</span>
              </TabsTrigger>
            </TabsList>

            {/* Story Tab */}
            <TabsContent value="story" className="mt-0">
              <div className="bg-card border border-border rounded-lg p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Description and Story */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Text Reader */}
                    <TextReader 
                      text={`${artworkForDisplay.description} ${artworkForDisplay.story}`}
                      title={artworkForDisplay.title}
                    />

                    {/* Quick Facts */}
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-foreground mb-4">About This Artwork</h2>
                      <div className="prose max-w-none">
                        <p className="text-foreground/80 leading-relaxed">{artworkForDisplay.description}</p>
                      </div>
                    </div>

                    {/* Detailed Story */}
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-foreground mb-4">The Story Behind It</h2>
                      <div className="prose max-w-none">
                        <p className="text-foreground/80 leading-relaxed">{artworkForDisplay.story}</p>
                      </div>
                    </div>
                  </div>

                  {/* Side Image */}
                  <div>
                    <img
                      src={artworkForDisplay.image}
                      alt={artworkForDisplay.title}
                      className="w-full h-auto rounded-lg shadow-md object-cover"
                    />
                  </div>
                </div>

                {/* Artwork Details Grid */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border pt-8">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/60 mb-2">Artist</h3>
                    <p className="text-lg font-semibold text-foreground">{artworkForDisplay.artist}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/60 mb-2">Year Created</h3>
                    <p className="text-lg font-semibold text-foreground">{artworkForDisplay.year}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/60 mb-2">Medium</h3>
                    <p className="text-lg font-semibold text-foreground">{artworkForDisplay.medium}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground/60 mb-2">Period</h3>
                    <p className="text-lg font-semibold text-foreground">{artworkForDisplay.period}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Audio Guide Tab */}
            {artworkForDisplay.audioUrl && (
              <TabsContent value="audio" className="mt-0">
                <div className="bg-card border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Audio Guide</h2>

                  {/* Audio Player */}
                  <div className="mb-8 p-6 bg-accent/5 rounded-lg">
                    <audio
                      controls
                      className="w-full mb-4"
                    >
                      <source src={artworkForDisplay.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                  {/* Transcript */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Transcript</h3>
                    <div className="bg-background p-6 rounded-lg border border-border">
                      <p className="text-foreground/80 leading-relaxed">
                        {artworkForDisplay.audioTranscript}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}

            {/* Video Guide Tab */}
            {artworkForDisplay.videoUrl && (
              <TabsContent value="video" className="mt-0">
                <div className="bg-card border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Video Guide</h2>

                  <div className="aspect-video bg-foreground/10 rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={artworkForDisplay.videoUrl}
                      title="Artwork Video Guide"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </TabsContent>
            )}

            {/* 3D Viewer Tab */}
            {artworkForDisplay.model3D && (
              <TabsContent value="3d" className="mt-0">
                <div className="bg-card border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-6">3D Model Viewer</h2>

                  <div className="rounded-lg overflow-hidden bg-white">
                    <Model3DViewer modelUrl={artworkForDisplay.model3D.url} title={artworkForDisplay.title} />
                  </div>

                  <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <p className="text-sm text-foreground/70">
                      💡 <strong>Tip:</strong> Use your mouse to rotate the model, scroll to zoom, and right-click to pan.
                    </p>
                  </div>
                </div>
              </TabsContent>
            )}

            {/* Quiz Tab */}
            <TabsContent value="quiz" className="mt-0">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Test Your Knowledge</h2>

                <QuizComponent artwork={artworkForDisplay} />
              </div>
            </TabsContent>
          </Tabs>

          {/* Recommendations & Feedback */}
          <div className="space-y-12 mt-16">
            <RecommendedArtworks currentArtworkId={artworkForDisplay.id} />
            <ReviewsDisplay artworkId={artworkForDisplay.id} />
            <FeedbackForm artworkId={artworkForDisplay.id} />
          </div>
        </div>
      </div>
      
      {/* AI Chatbot */}
      <ArtworkChatbot 
        artwork={{
          title: artwork.title,
          artist: artwork.artist,
          year: artwork.yearCreated,
          description: artwork.description,
          story: artwork.story || artwork.description,
          medium: artwork.medium || 'Unknown',
          period: artwork.period || 'Unknown'
        }}
        language={currentLanguage}
      />
      
      <Footer />
    </>
  )
}

// Quiz Component
function QuizComponent({ artwork }: { artwork: any }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      question: `Who is the artist of "${artwork.title}"?`,
      options: [artwork.artist, "Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh"],
      correct: 0
    },
    {
      question: `In what year was "${artwork.title}" created?`,
      options: [artwork.year.toString(), "1885", "1925", "1950"],
      correct: 0
    },
    {
      question: `What medium was used for "${artwork.title}"?`,
      options: [artwork.medium, "Watercolor", "Acrylic", "Marble"],
      correct: 0
    }
  ]

  const handleAnswerClick = (optionIndex: number) => {
    if (optionIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  if (showResults) {
    return (
      <div className="text-center py-8">
        <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
        <h3 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h3>
        <p className="text-xl text-accent font-semibold mb-6">
          Your Score: {score} / {questions.length}
        </p>
        <Button
          onClick={() => {
            setCurrentQuestion(0)
            setScore(0)
            setShowResults(false)
          }}
          className="bg-accent hover:bg-accent/90"
        >
          Retake Quiz
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-foreground/60">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-foreground/10 rounded-full h-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          {questions[currentQuestion].question}
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {questions[currentQuestion].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerClick(idx)}
              className="p-4 text-left border-2 border-border rounded-lg hover:bg-accent/10 hover:border-accent transition-all font-medium text-foreground/80 hover:text-foreground"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-foreground/60">
        <p>Challenge yourself with a quick quiz about this masterpiece!</p>
      </div>
    </div>
  )
}
