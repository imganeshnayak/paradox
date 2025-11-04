"use client"

import { useState, useEffect } from "react"
import { Star, MessageCircle } from "lucide-react"

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
}

interface Review {
  _id: string
  rating: number
  comment: string
  createdAt: string
}

interface ReviewsDisplayProps {
  artworkId: string
}

export function ReviewsDisplay({ artworkId }: ReviewsDisplayProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    totalLikes: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const backendUrl = getBackendUrl()
        const response = await fetch(`${backendUrl}/api/reviews/${artworkId}/reviews`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data.reviews)
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [artworkId])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Visitor Reviews</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-border">
        <div>
          <p className="text-sm text-foreground/60 mb-1">Average Rating</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-foreground">{stats.averageRating}</span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.round(stats.averageRating)
                      ? "fill-accent text-accent"
                      : "text-muted-foreground"
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-foreground/60 mb-1">Total Reviews</p>
          <p className="text-3xl font-bold text-foreground">{stats.totalReviews}</p>
        </div>

        <div>
          <p className="text-sm text-foreground/60 mb-1">Total Likes</p>
          <p className="text-3xl font-bold text-red-500">{stats.totalLikes}</p>
        </div>

        <div>
          <p className="text-sm text-foreground/60 mb-2">Rating Distribution</p>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-xs text-foreground/60 w-3">{rating}</span>
                <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent"
                    style={{
                      width: stats.totalReviews > 0
                        ? `${(stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100}%`
                        : "0%"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-foreground/60">No reviews yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-foreground/50">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-foreground text-sm">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
