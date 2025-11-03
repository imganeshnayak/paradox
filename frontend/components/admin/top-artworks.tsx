"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface TopArtwork {
  artworkId: string
  views: number
  uniqueVisitors: number
  avgDwellTime: number
}

export function TopArtworks() {
  const [artworks, setArtworks] = useState<TopArtwork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopArtworks = async () => {
      try {
        const token = localStorage.getItem('admin-token')
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
        
        const response = await fetch(`${backendUrl}/api/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const dashboardData = await response.json()
          if (dashboardData.topArtworks) {
            setArtworks(dashboardData.topArtworks)
          }
        }
      } catch (error) {
        console.error('Failed to fetch top artworks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopArtworks()
  }, [])

  return (
    <Card className="bg-card border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Top Artworks</h3>
      </div>
      <div className="space-y-4">
        {loading ? (
          <p className="text-foreground/60 text-center py-4">Loading top artworks...</p>
        ) : artworks.length > 0 ? (
          artworks.map((artwork, index) => (
            <div
              key={artwork.artworkId}
              className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-foreground">Artwork #{artwork.artworkId.slice(0, 8)}</p>
                  <p className="text-xs text-foreground/60">{artwork.uniqueVisitors} unique visitors</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{artwork.views} views</p>
                <p className="text-xs text-accent">{artwork.avgDwellTime}s avg time</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-foreground/60 text-center py-4">No artwork data available</p>
        )}
      </div>
    </Card>
  )
}
