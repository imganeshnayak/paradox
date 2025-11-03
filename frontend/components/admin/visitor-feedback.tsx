"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MessageSquare, Star } from "lucide-react"

interface Feedback {
  _id: string
  visitorName: string
  rating: number
  feedback: string
  artworkId?: string
  createdAt: string
}

export function VisitorFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
        
        const response = await fetch(`${backendUrl}/api/feedback`, {
          method: 'GET',
        })

        if (response.ok) {
          const data = await response.json()
          if (data.feedback) {
            setFeedback(data.feedback.slice(0, 4))
          }
        }
      } catch (error) {
        console.error('Failed to fetch feedback:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  return (
    <Card className="bg-card border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Recent Feedback</h3>
      </div>
      <div className="space-y-4">
        {loading ? (
          <p className="text-foreground/60 text-center py-4">Loading feedback...</p>
        ) : feedback.length > 0 ? (
          feedback.map((item) => (
            <div key={item._id} className="p-4 bg-background rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{item.visitorName}</p>
                  <p className="text-xs text-foreground/60">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < item.rating ? "fill-accent text-accent" : "text-muted-foreground"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-foreground/70 italic">{`"${item.feedback}"`}</p>
            </div>
          ))
        ) : (
          <p className="text-foreground/60 text-center py-4">No feedback available yet</p>
        )}
      </div>
    </Card>
  )
}
