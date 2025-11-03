"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Smile, Frown } from "lucide-react"
import { toast } from "sonner"

export function InstantFeedbackSystem() {
  const [isVisible, setIsVisible] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Show feedback prompt after 30 seconds (simulating leaving the museum)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 30000)

    return () => clearTimeout(timer)
  }, [])

  const handleFeedback = (type: "love" | "happy" | "sad") => {
    setSubmitted(true)
    const messages = {
      love: "Thank you! We're glad you loved this experience.",
      happy: "Thank you for your positive feedback!",
      sad: "Your feedback helps us improve. Thank you!",
    }

    toast.success(messages[type])

    setTimeout(() => {
      setIsVisible(false)
      setSubmitted(false)
    }, 2000)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="p-4 shadow-lg border-2 border-primary bg-card">
        <h3 className="font-serif font-bold text-foreground mb-3">Quick Feedback</h3>
        <p className="text-sm text-foreground/70 mb-4">How was your museum experience?</p>

        {!submitted ? (
          <div className="flex gap-2">
            <Button
              onClick={() => handleFeedback("love")}
              variant="outline"
              className="flex-1 hover:bg-red-50"
              size="sm"
            >
              <Heart size={16} className="text-red-500" />
            </Button>
            <Button
              onClick={() => handleFeedback("happy")}
              variant="outline"
              className="flex-1 hover:bg-green-50"
              size="sm"
            >
              <Smile size={16} className="text-green-500" />
            </Button>
            <Button
              onClick={() => handleFeedback("sad")}
              variant="outline"
              className="flex-1 hover:bg-blue-50"
              size="sm"
            >
              <Frown size={16} className="text-blue-500" />
            </Button>
            <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm">
              Skip
            </Button>
          </div>
        ) : (
          <div className="text-sm text-green-600 font-semibold">Feedback submitted! Thank you.</div>
        )}
      </Card>
    </div>
  )
}
