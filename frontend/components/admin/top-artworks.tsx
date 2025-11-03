import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const topArtworks = [
  { rank: 1, title: "The Kiss", artist: "Klimt", views: 1250, rating: 4.8 },
  { rank: 2, title: "Starry Night", artist: "van Gogh", views: 1180, rating: 4.9 },
  { rank: 3, title: "Girl w/ Pearl", artist: "Vermeer", views: 980, rating: 4.7 },
  { rank: 4, title: "Persistence", artist: "Dalí", views: 850, rating: 4.6 },
  { rank: 5, title: "The Scream", artist: "Munch", views: 720, rating: 4.4 },
]

export function TopArtworks() {
  return (
    <Card className="bg-card border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Top Artworks</h3>
      </div>
      <div className="space-y-4">
        {topArtworks.map((artwork) => (
          <div
            key={artwork.rank}
            className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {artwork.rank}
              </div>
              <div>
                <p className="font-medium text-foreground">{artwork.title}</p>
                <p className="text-xs text-foreground/60">{artwork.artist}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{artwork.views} views</p>
              <p className="text-xs text-accent">{artwork.rating}★</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
