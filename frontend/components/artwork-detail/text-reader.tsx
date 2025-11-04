"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square } from "lucide-react"

interface TextReaderProps {
  text: string
  title: string
}

export function TextReader({ text, title }: TextReaderProps) {
  const [isReading, setIsReading] = useState(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)

  useEffect(() => {
    // Check if browser supports Web Speech API
    const speechSynthesisSupported = 
      typeof window !== "undefined" && 
      (window.speechSynthesis !== undefined || 
       (window as any).webkitSpeechSynthesis !== undefined)
    
    setIsSpeechSupported(speechSynthesisSupported)
  }, [])

  const handleRead = () => {
    if (!isSpeechSupported) {
      alert("Text-to-speech is not supported in your browser")
      return
    }

    if (isReading) {
      // Stop reading
      window.speechSynthesis.cancel()
      setIsReading(false)
    } else {
      // Start reading
      try {
        // Cancel any existing speech first
        window.speechSynthesis.cancel()
        
        // Create new utterance with explicit settings
        const utterance = new SpeechSynthesisUtterance(text)
        
        // Set speech parameters
        utterance.rate = 1.0       // Normal speed
        utterance.pitch = 1.0      // Normal pitch
        utterance.volume = 1.0     // Maximum volume
        
        // Set event handlers
        utterance.onstart = () => {
          console.log("Speech started")
          setIsReading(true)
        }
        
        utterance.onend = () => {
          console.log("Speech ended")
          setIsReading(false)
        }
        
        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
          console.error("Speech error:", event.error)
          setIsReading(false)
        }
        
        utterance.onpause = () => {
          console.log("Speech paused")
        }
        
        utterance.onresume = () => {
          console.log("Speech resumed")
        }
        
        // Speak the text
        window.speechSynthesis.speak(utterance)
      } catch (error) {
        console.error("Error in text-to-speech:", error)
        setIsReading(false)
      }
    }
  }

  return (
    <Button
      onClick={handleRead}
      variant="outline"
      size="sm"
      disabled={!isSpeechSupported}
      title={
        !isSpeechSupported 
          ? "Text-to-speech not supported" 
          : isReading 
            ? "Stop reading" 
            : "Read text aloud"
      }
      className={
        isReading 
          ? "bg-accent/10 border-accent text-accent hover:bg-accent/20" 
          : !isSpeechSupported
            ? "opacity-50 cursor-not-allowed"
            : ""
      }
    >
      {isReading ? (
        <>
          <Square className="w-4 h-4 mr-2 fill-current" />
          Stop Reading
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 mr-2" />
          Read Aloud
        </>
      )}
    </Button>
  )
}
