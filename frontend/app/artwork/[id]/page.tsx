"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArtworkHeader } from "@/components/artwork-detail/artwork-header"
import { RecommendedArtworks } from "@/components/artwork-detail/recommended-artworks"
import { FeedbackForm } from "@/components/artwork-detail/feedback-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Volume2, Play, Cuboid, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock artwork data
const artworkData: Record<string, any> = {
  "1": {
    id: "1",
    title: "Starry Night",
    artist: "Vincent van Gogh",
    year: 1889,
    medium: "Oil on canvas",
    period: "Post-Impressionism",
    dimensions: "73.7 cm × 92.1 cm",
    location: "Museum of Modern Art, New York",
    image: "/placeholder.svg?key=37jeg",
    description:
      "A swirling night sky over a sleeping village, one of the most iconic paintings in art history. This masterpiece captures the artist's emotional turbulence and fascination with the night sky, featuring a dynamic composition with bold brushstrokes.",
    audioUrl: "https://example.com/audio/starry-night.mp3",
    audioTranscript:
      "In this iconic work, Van Gogh painted his vision of the night sky with remarkable energy. The eleven stars and crescent moon shine brightly, while the village below remains peaceful and still...",
    videoUrl: "https://www.youtube.com/embed/e3IWaPlw1FY",
    history:
      "Created in Saint-Paul-de-Mausole asylum where Van Gogh was staying, this painting reflects both his struggles and his profound connection to nature.",
    tags: ["landscape", "night", "famous"],
    dwell_time_avg: 8.5,
    model3D: {
      url: "https://res.cloudinary.com/dahotkqpi/raw/upload/v1/starry-night-3d.glb",
      format: "glb"
    }
  },
  "2": {
    id: "2",
    title: "The Persistence of Memory",
    artist: "Salvador Dalí",
    year: 1931,
    medium: "Oil on canvas",
    period: "Surrealism",
    dimensions: "24 cm × 33 cm",
    location: "Museum of Modern Art, New York",
    image: "/placeholder.svg?key=iog78",
    description:
      "Melting clocks in a dreamlike landscape, exploring the nature of time and reality. This small but mighty painting has become one of the most recognizable works of the Surrealist movement.",
    audioUrl: "https://example.com/audio/persistence-of-memory.mp3",
    audioTranscript:
      "Dalí's masterpiece challenges our perception of time. The soft, melting watches represent the irrelevance of time in the dream world...",
    videoUrl: "https://www.youtube.com/embed/example",
    history:
      "Painted during a period of intense creativity, this work emerged from Dalí's exploration of Freudian psychology and dream imagery.",
    tags: ["surrealism", "abstract", "famous"],
    dwell_time_avg: 7.2,
  },
  "3": {
    id: "3",
    title: "The Kiss",
    artist: "Gustav Klimt",
    year: 1908,
    medium: "Oil and gold leaf on canvas",
    period: "Art Nouveau",
    dimensions: "180 cm × 180 cm",
    location: "Österreichische Galerie Belvedere, Vienna",
    image: "/placeholder.svg?key=htigk",
    description:
      "An intimate moment depicted in gold and precious materials, embodying romantic love. This monumental work combines opulent decoration with genuine emotion, representing Klimt's signature use of gold leaf.",
    audioUrl: "https://example.com/audio/the-kiss.mp3",
    audioTranscript:
      "Klimt's use of gold leaf elevates this intimate moment to the sacred. The couple's embrace is surrounded by elaborate patterns that speak to both luxury and spirituality...",
    videoUrl: "https://www.youtube.com/embed/example",
    history:
      "Created at the height of Klimt's artistic career, this painting represents the synthesis of Art Nouveau aesthetics and profound human emotion.",
    tags: ["romance", "decorative", "famous"],
    dwell_time_avg: 9.1,
  },
}

export default function ArtworkDetailPage() {
  const params = useParams()
  const id = params.id as string
  const artwork = artworkData[id]
  const [liked, setLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("story")

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <ArtworkHeader artwork={artwork} liked={liked} onLikeToggle={() => setLiked(!liked)} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

              <TabsTrigger
                value="audio"
                className="flex items-center gap-2 data-[state=active]:bg-accent/20 rounded"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Audio</span>
              </TabsTrigger>

              <TabsTrigger
                value="video"
                className="flex items-center gap-2 data-[state=active]:bg-accent/20 rounded"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Video</span>
              </TabsTrigger>

              <TabsTrigger
                value="3d"
                className="flex items-center gap-2 data-[state=active]:bg-accent/20 rounded"
              >
                <Cuboid className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">3D</span>
              </TabsTrigger>

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
                  {/* Main Description */}
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-4">About This Artwork</h2>
                    <div className="prose max-w-none">
                      <p className="text-foreground/80 leading-relaxed mb-4">{artwork.description}</p>
                      <p className="text-foreground/70 leading-relaxed">{artwork.history}</p>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground/60 mb-2">Artist</h3>
                        <p className="text-lg font-semibold text-foreground">{artwork.artist}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground/60 mb-2">Year Created</h3>
                        <p className="text-lg font-semibold text-foreground">{artwork.year}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground/60 mb-2">Medium</h3>
                        <p className="text-lg font-semibold text-foreground">{artwork.medium}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground/60 mb-2">Period</h3>
                        <p className="text-lg font-semibold text-foreground">{artwork.period}</p>
                      </div>
                    </div>
                  </div>

                  {/* Side Image */}
                  <div>
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-auto rounded-lg shadow-md object-cover"
                    />
                    <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                      <p className="text-sm text-foreground/70">{artwork.dimensions}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Audio Guide Tab */}
            <TabsContent value="audio" className="mt-0">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Audio Guide</h2>

                {/* Audio Player */}
                <div className="mb-8 p-6 bg-accent/5 rounded-lg">
                  <audio
                    controls
                    className="w-full mb-4"
                  >
                    <source src={artwork.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>

                {/* Transcript */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Transcript</h3>
                  <div className="bg-background p-6 rounded-lg border border-border">
                    <p className="text-foreground/80 leading-relaxed">
                      {artwork.audioTranscript}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Video Guide Tab */}
            <TabsContent value="video" className="mt-0">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Video Guide</h2>

                <div className="aspect-video bg-foreground/10 rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={artwork.videoUrl}
                    title="Artwork Video Guide"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </TabsContent>

            {/* 3D Viewer Tab */}
            <TabsContent value="3d" className="mt-0">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">3D Model Viewer</h2>

                <div className="aspect-video bg-foreground/10 rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <Cuboid className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                    <p className="text-foreground/60 font-medium">3D Model Viewer</p>
                    <p className="text-sm text-foreground/40 mt-2">Interact with the 3D model using mouse or touch</p>
                    {artwork.model3D && (
                      <a
                        href={artwork.model3D.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:opacity-90"
                      >
                        View Full 3D Model
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Quiz Tab */}
            <TabsContent value="quiz" className="mt-0">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Test Your Knowledge</h2>

                <QuizComponent artwork={artwork} />
              </div>
            </TabsContent>
          </Tabs>

          {/* Recommendations & Feedback */}
          <div className="space-y-12 mt-16">
            <RecommendedArtworks currentArtworkId={artwork.id} />
            <FeedbackForm artworkId={artwork.id} />
          </div>
        </div>
      </div>
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
