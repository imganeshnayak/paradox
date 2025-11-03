interface ArtworkInfoProps {
  artwork: any
}

export function ArtworkInfo({ artwork }: ArtworkInfoProps) {
  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-lg p-8">
        <h2 className="text-2xl font-serif font-bold text-foreground mb-4">About This Artwork</h2>
        <p className="text-foreground/80 leading-relaxed mb-6">{artwork.description}</p>
        <h3 className="text-lg font-semibold text-foreground mb-3">Historical Context</h3>
        <p className="text-foreground/80 leading-relaxed">{artwork.history}</p>
      </div>
    </div>
  )
}
