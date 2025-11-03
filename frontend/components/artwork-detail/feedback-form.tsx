"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, Send, Loader2 } from "lucide-react"
import { getSessionId } from "@/lib/session-id"

interface FeedbackFormProps {
  artworkId: string
}

export function FeedbackForm({ artworkId }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setLoading(true)
    setError("")

    try {
      const sessionId = getSessionId()
      
      const response = await fetch(`/api/reviews/${artworkId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment: feedback,
          sessionId
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit review")
      }

      setSubmitted(true)
      setRating(0)
      setFeedback("")
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Share Your Thoughts</h2>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 text-sm">
          Thank you for your feedback! Your insights help us improve the museum experience.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">How did you enjoy this artwork?</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                disabled={loading}
                className="transition-transform hover:scale-110 disabled:opacity-50"
              >
                <Star size={28} className={star <= rating ? "fill-accent text-accent" : "text-muted-foreground"} />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Your Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What did you think about this artwork? Any suggestions?"
            disabled={loading}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            rows={4}
          />
        </div>

        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full disabled:opacity-50">
          {loading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} className="mr-2" />
              Submit Feedback
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
