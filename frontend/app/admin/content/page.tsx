"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Save, X, AlertCircle, CheckCircle } from "lucide-react"

interface Artwork {
  _id: string
  title: string
  artist: string
  description: string
  story?: string
  type: string
}

export default function AdminContentPage() {
  const router = useRouter()
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [description, setDescription] = useState("")
  const [story, setStory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const token = localStorage.getItem('admin-token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    
    fetchArtworks()
  }, [router])

  const fetchArtworks = async () => {
    try {
      const token = localStorage.getItem('admin-token')
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      
      const response = await fetch(`${backendUrl}/api/admin/artworks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setArtworks(data.artworks || [])
      }
    } catch (error) {
      console.error('Failed to fetch artworks:', error)
      setMessage({ type: 'error', text: 'Failed to load artworks' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork)
    setDescription(artwork.description || "")
    setStory(artwork.story || "")
    setMessage(null)
  }

  const handleSaveContent = async () => {
    if (!selectedArtwork) return

    setIsSaving(true)
    try {
      const token = localStorage.getItem('admin-token')
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

      const response = await fetch(`${backendUrl}/api/admin/artworks/${selectedArtwork._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description,
          story
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Update local state
        setArtworks(artworks.map(art => 
          art._id === selectedArtwork._id ? data.artwork : art
        ))
        setSelectedArtwork(data.artwork)
        setMessage({ type: 'success', text: 'Content updated successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to save content' })
      }
    } catch (error) {
      console.error('Failed to save content:', error)
      setMessage({ type: 'error', text: 'Failed to save content' })
    } finally {
      setIsSaving(false)
    }
  }

  const filteredArtworks = artworks.filter(art =>
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-foreground/60">Loading...</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <AdminHeader 
          timeRange="week"
          onTimeRangeChange={() => {}}
          onUploadClick={() => {}}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.push('/admin')}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Artworks List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Artworks</CardTitle>
                  <CardDescription>Select an artwork to edit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Search artworks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                  />
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredArtworks.length === 0 ? (
                      <p className="text-sm text-foreground/60">No artworks found</p>
                    ) : (
                      filteredArtworks.map((artwork) => (
                        <button
                          key={artwork._id}
                          onClick={() => handleSelectArtwork(artwork)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            selectedArtwork?._id === artwork._id
                              ? 'bg-accent/20 border-accent'
                              : 'border-border hover:bg-card/50'
                          }`}
                        >
                          <p className="font-semibold text-sm text-foreground">{artwork.title}</p>
                          <p className="text-xs text-foreground/60">{artwork.artist}</p>
                          <p className="text-xs text-foreground/50 capitalize">{artwork.type}</p>
                        </button>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Editor */}
            <div className="lg:col-span-2">
              {selectedArtwork ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{selectedArtwork.title}</CardTitle>
                        <CardDescription>{selectedArtwork.artist}</CardDescription>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedArtwork(null)
                          setMessage(null)
                        }}
                        className="text-foreground/60 hover:text-foreground"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Message Alert */}
                    {message && (
                      <Alert className={message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}>
                        <div className="flex items-center gap-2">
                          {message.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                            {message.text}
                          </AlertDescription>
                        </div>
                      </Alert>
                    )}

                    <Tabs defaultValue="description" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="story">Story</TabsTrigger>
                      </TabsList>

                      <TabsContent value="description" className="space-y-4 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Description (Brief Summary)
                          </label>
                          <p className="text-xs text-foreground/60 mb-3">
                            A short, concise description of the artwork. This appears on the main card and quick reference.
                          </p>
                          <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter a brief description of the artwork..."
                            className="min-h-32 resize-none"
                          />
                          <p className="text-xs text-foreground/60 mt-2">
                            {description.length} characters
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="story" className="space-y-4 mt-4">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Story (Detailed Narrative)
                          </label>
                          <p className="text-xs text-foreground/60 mb-3">
                            A detailed narrative about the artwork's creation, context, symbolism, and historical significance. This appears in "The Story Behind It" section.
                          </p>
                          <Textarea
                            value={story}
                            onChange={(e) => setStory(e.target.value)}
                            placeholder="Enter the detailed story of the artwork..."
                            className="min-h-48 resize-none"
                          />
                          <p className="text-xs text-foreground/60 mt-2">
                            {story.length} characters
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Preview Section */}
                    <div className="border-t border-border pt-6">
                      <h3 className="text-sm font-semibold text-foreground mb-4">Preview</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-foreground/60 mb-2">DESCRIPTION</p>
                          <p className="text-sm text-foreground leading-relaxed">{description || 'No description'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground/60 mb-2">STORY</p>
                          <p className="text-sm text-foreground leading-relaxed">{story || 'No story'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                      <Button
                        onClick={handleSaveContent}
                        disabled={isSaving}
                        className="flex-1 gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setDescription(selectedArtwork.description || "")
                          setStory(selectedArtwork.story || "")
                          setMessage(null)
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center min-h-96">
                    <p className="text-foreground/60">Select an artwork to edit its content</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
