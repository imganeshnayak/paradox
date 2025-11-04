"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ArtworkChatbotProps {
  artwork: {
    title: string
    artist: string
    year: number
    description: string
    story: string
    medium: string
    period: string
  }
  language: string
}

export function ArtworkChatbot({ artwork, language }: ArtworkChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isUserTyping, setIsUserTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMsg = getWelcomeMessage(language)
      setMessages([{
        id: '1',
        text: welcomeMsg,
        sender: 'bot',
        timestamp: new Date()
      }])
    }
  }, [isOpen, language])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const getWelcomeMessage = (lang: string) => {
    const messages = {
      en: `Hello! I'm your AI guide for "${artwork.title}" by ${artwork.artist}. Ask me anything about this artwork!`,
      es: `¡Hola! Soy tu guía de IA para "${artwork.title}" de ${artwork.artist}. ¡Pregúntame cualquier cosa sobre esta obra!`,
      fr: `Bonjour ! Je suis votre guide IA pour "${artwork.title}" de ${artwork.artist}. Posez-moi des questions sur cette œuvre !`
    }
    return messages[lang as keyof typeof messages] || messages.en
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Call backend API to get AI response
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputValue,
          artwork: {
            title: artwork.title,
            artist: artwork.artist,
            year: artwork.year,
            description: artwork.description,
            story: artwork.story,
            medium: artwork.medium,
            period: artwork.period
          },
          language: language
        })
      })

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.answer || 'Sorry, I could not generate a response.',
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    
    // Show typing indicator
    setIsUserTyping(true)
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Hide typing indicator after 1.5 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false)
    }, 1500)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-accent hover:bg-accent/90 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-full sm:w-96 max-w-[calc(100vw-3rem)] h-[500px] sm:h-[600px] max-h-[calc(100vh-3rem)] shadow-2xl flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
        <CardTitle className="text-lg font-semibold">AI Art Guide</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col p-0 overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
        {/* 3D Robot Model - Small, bottom-right, hidden while typing */}
        {!isUserTyping && (
          <div className="absolute bottom-20 right-0 z-10 w-40 h-40 pointer-events-none">
            <style>{`
              iframe[title="AI Assistant Robot"] {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
              }
              /* Hide Spline watermark */
              iframe[title="AI Assistant Robot"]::after {
                display: none !important;
              }
              .spline-watermark {
                display: none !important;
              }
            `}</style>
            <iframe 
              src='https://my.spline.design/greetingrobot-S0D5T8vmFbhMNtZ3WcbXZpdw/' 
              frameBorder='0' 
              width='100%'
              height='100%'
              className="w-full h-full"
              title="AI Assistant Robot"
              loading="lazy"
              style={{ 
                border: 0, 
                display: 'block',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            />
          </div>
        )}

        <ScrollArea className="flex-1 p-4 min-h-0">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-accent text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4 flex-shrink-0 bg-background">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={language === 'es' ? 'Escribe tu pregunta...' : language === 'fr' ? 'Tapez votre question...' : 'Type your question...'}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
