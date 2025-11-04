"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { getSessionId } from "@/lib/session-id"

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
}

interface LikeButtonProps {
  artworkId: string
}

export function LikeButton({ artworkId }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [totalLikes, setTotalLikes] = useState(0)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  // Check if user has already liked this artwork
  useEffect(() => {
    const checkLike = async () => {
      try {
        const backendUrl = getBackendUrl()
        const sessionId = getSessionId()
        const response = await fetch(`${backendUrl}/api/reviews/${artworkId}/like/check?sessionId=${sessionId}`)
        
        if (response.ok) {
          const data = await response.json()
          setLiked(data.liked)
          setTotalLikes(data.totalLikes)
        }
      } catch (error) {
        console.error('Failed to check like status:', error)
      } finally {
        setChecking(false)
      }
    }

    checkLike()
  }, [artworkId])

  const handleLike = async () => {
    if (loading || checking) return

    setLoading(true)
    try {
      const backendUrl = getBackendUrl()
      const sessionId = getSessionId()
      const response = await fetch(`${backendUrl}/api/reviews/${artworkId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId })
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(data.liked)
        setTotalLikes(data.totalLikes)
      }
    } catch (error) {
      console.error('Failed to toggle like:', error)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted animate-pulse">
        <Heart size={20} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-accent hover:bg-accent/10 transition-all disabled:opacity-50"
    >
      <Heart
        size={20}
        className={`transition-all ${
          liked
            ? "fill-red-500 text-red-500"
            : "text-foreground hover:text-red-500"
        }`}
      />
      <span className={`text-sm font-medium ${liked ? "text-red-500" : "text-foreground"}`}>
        {totalLikes}
      </span>
    </button>
  )
}
