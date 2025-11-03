"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Star, Send } from "lucide-react"

interface FeedbackFormProps {
  artworkId: string
}

export function FeedbackForm({ artworkId }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle feedback submission
    setSubmitted(true)
    setRating(0)
    setFeedback("")
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Share Your Thoughts</h2>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          Thank you for your feedback! Your insights help us improve the museum experience.
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
                className="transition-transform hover:scale-110"
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
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
          />
        </div>

        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
          <Send size={18} className="mr-2" />
          Submit Feedback
        </Button>
      </form>
    </div>
  )
}
