import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"

interface Artwork {
  id: string
  title: string
  artist: string
  year: number
  image: string
  tags: string[]
}

interface ArtworkGridProps {
  artworks: Artwork[]
}

export function ArtworkGrid({ artworks }: ArtworkGridProps) {
  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-foreground/60">No artworks found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {artworks.map((artwork) => (
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
                    <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80">
                  <Music size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
