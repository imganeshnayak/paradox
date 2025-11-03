import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, ArrowRight } from "lucide-react"

interface RecommendedArtworksProps {
  currentArtworkId: string
}

const recommendedArtworks = [
  {
    id: "2",
    title: "The Persistence of Memory",
    artist: "Salvador Dalí",
    year: 1931,
    image: "/placeholder.svg?key=iog78",
    tags: ["surrealism", "famous"],
  },
  {
    id: "3",
    title: "The Kiss",
    artist: "Gustav Klimt",
    year: 1908,
    image: "/placeholder.svg?key=htigk",
    tags: ["romance", "famous"],
  },
]

export function RecommendedArtworks({ currentArtworkId }: RecommendedArtworksProps) {
  const recommendations = recommendedArtworks.filter((a) => a.id !== currentArtworkId)

  return (
    <div className="bg-secondary/30 border border-secondary rounded-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-foreground">You Might Also Like</h2>
        <Link href="/explore">
          <Button variant="outline" size="sm">
            View All <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((artwork) => (
          <Link key={artwork.id} href={`/artwork/${artwork.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="aspect-video bg-muted relative overflow-hidden">
                <img
                  src={artwork.image || "/placeholder.svg"}
                  alt={artwork.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-1">{artwork.title}</h3>
                <p className="text-sm text-foreground/70 mb-3">
                  {artwork.artist} • {artwork.year}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {artwork.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary">
                    <Music size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
