"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArtworkHeader } from "@/components/artwork-detail/artwork-header"
import { AudioGuide } from "@/components/artwork-detail/audio-guide"
import { ArtworkInfo } from "@/components/artwork-detail/artwork-info"
import { RecommendedArtworks } from "@/components/artwork-detail/recommended-artworks"
import { FeedbackForm } from "@/components/artwork-detail/feedback-form"
import { AIVideoGuide } from "@/components/artwork-detail/ai-video-guide"
import { Viewer3D } from "@/components/artwork-detail/3d-viewer"

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
    videoUrl: "https://example.com/video/starry-night.mp4",
    history:
      "Created in Saint-Paul-de-Mausole asylum where Van Gogh was staying, this painting reflects both his struggles and his profound connection to nature.",
    tags: ["landscape", "night", "famous"],
    dwell_time_avg: 8.5,
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
    videoUrl: "https://example.com/video/persistence.mp4",
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
    videoUrl: "https://example.com/video/kiss.mp4",
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <ArtworkInfo artwork={artwork} />
              <AudioGuide artwork={artwork} />
              <AIVideoGuide artwork={artwork} />
              <Viewer3D artwork={artwork} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Artwork Details</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-foreground/60 mb-1">Artist</p>
                      <p className="text-foreground font-medium">{artwork.artist}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 mb-1">Year</p>
                      <p className="text-foreground font-medium">{artwork.year}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 mb-1">Period</p>
                      <p className="text-foreground font-medium">{artwork.period}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 mb-1">Medium</p>
                      <p className="text-foreground font-medium">{artwork.medium}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 mb-1">Dimensions</p>
                      <p className="text-foreground font-medium">{artwork.dimensions}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 mb-1">Location</p>
                      <p className="text-foreground font-medium">{artwork.location}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/10 border border-accent rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-2">Museum Tip</h3>
                  <p className="text-sm text-foreground/70">
                    Average visitors spend {artwork.dwell_time_avg} minutes viewing this artwork.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations & Feedback */}
          <div className="space-y-12">
            <RecommendedArtworks currentArtworkId={artwork.id} />
            <FeedbackForm artworkId={artwork.id} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
