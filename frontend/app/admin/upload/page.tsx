"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2, Upload, Image, Cuboid, Music, Film } from "lucide-react"

export default function UploadArtworkPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Metadata
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [year, setYear] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")

  // Files
  const [images, setImages] = useState<FileList | null>(null)
  const [model3d, setModel3d] = useState<File | null>(null)
  const [audio, setAudio] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Validate required fields
      if (!title.trim() || !artist.trim() || !year.trim() || !description.trim()) {
        throw new Error("Please fill in all metadata fields")
      }

      if (!images || images.length === 0) {
        throw new Error("Please upload at least one image")
      }

      // Create FormData
      const formData = new FormData()
      formData.append("title", title)
      formData.append("artist", artist)
      formData.append("year", year)
      formData.append("description", description)
      formData.append("tags", tags)

      // Add images
      Array.from(images).forEach((file) => {
        formData.append("images", file)
      })

      // Add optional files
      if (model3d) formData.append("model3d", model3d)
      if (audio) formData.append("audio", audio)
      if (video) formData.append("video", video)

      // Send to backend
      const response = await fetch("/api/admin/artwork-upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Upload failed")
      }

      setSuccess(true)
      // Reset form
      setTimeout(() => {
        setTitle("")
        setArtist("")
        setYear("")
        setDescription("")
        setTags("")
        setImages(null)
        setModel3d(null)
        setAudio(null)
        setVideo(null)
        setSuccess(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setTitle("")
    setArtist("")
    setYear("")
    setDescription("")
    setTags("")
    setImages(null)
    setModel3d(null)
    setAudio(null)
    setVideo(null)
    setError("")
    setSuccess(false)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary rounded-lg">
                <Upload size={32} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-serif font-bold text-foreground">Upload New Artwork</h1>
                <p className="text-foreground/60 mt-2">Add a new piece to the museum collection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Metadata Section */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h2 className="text-2xl font-bold">Artwork Information</h2>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">Title *</label>
                    <Input
                      placeholder="e.g., The Starry Night"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={loading}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">Artist *</label>
                    <Input
                      placeholder="e.g., Vincent van Gogh"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      disabled={loading}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">Year Created *</label>
                    <Input
                      placeholder="e.g., 1889"
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      disabled={loading}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">Tags</label>
                    <Input
                      placeholder="e.g., painting, impressionism, night"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      disabled={loading}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold">Description *</label>
                  <Textarea
                    placeholder="Detailed description of the artwork, artist background, historical context..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    disabled={loading}
                    className="resize-none"
                  />
                </div>
              </div>
            </Card>

            {/* Media Section */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h2 className="text-2xl font-bold">Media Files</h2>
              </div>

              <div className="space-y-6">
                {/* Images */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Image size={20} className="text-primary" />
                    <label className="text-sm font-semibold">Images *</label>
                  </div>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImages(e.target.files)}
                      disabled={loading}
                      className="hidden"
                      id="images-input"
                    />
                    <label htmlFor="images-input" className="cursor-pointer block">
                      <div className="text-center">
                        <Image size={32} className="mx-auto mb-2 text-foreground/40" />
                        <p className="text-sm font-medium">Click to select images</p>
                        <p className="text-xs text-foreground/50 mt-1">
                          Multiple images supported (JPG, PNG, WebP)
                        </p>
                      </div>
                    </label>
                  </div>
                  {images?.length ? (
                    <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        ✓ {images.length} image(s) selected
                      </p>
                      <ul className="text-xs text-green-600 dark:text-green-400 mt-2 space-y-1">
                        {Array.from(images).map((file, idx) => (
                          <li key={idx}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                {/* 3D Model */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Cuboid size={20} className="text-accent" />
                    <label className="text-sm font-semibold">3D Model (Optional)</label>
                  </div>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-accent/50 transition">
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      onChange={(e) => setModel3d(e.target.files?.[0] || null)}
                      disabled={loading}
                      className="hidden"
                      id="model-input"
                    />
                    <label htmlFor="model-input" className="cursor-pointer block">
                      <div className="text-center">
                        <Cuboid size={32} className="mx-auto mb-2 text-foreground/40" />
                        <p className="text-sm font-medium">Click to select 3D model</p>
                        <p className="text-xs text-foreground/50 mt-1">Supported: .glb, .gltf</p>
                      </div>
                    </label>
                  </div>
                  {model3d ? (
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        ✓ {model3d.name}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Audio */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Music size={20} className="text-yellow-600" />
                    <label className="text-sm font-semibold">Audio Guide (Optional)</label>
                  </div>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-yellow-600/50 transition">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudio(e.target.files?.[0] || null)}
                      disabled={loading}
                      className="hidden"
                      id="audio-input"
                    />
                    <label htmlFor="audio-input" className="cursor-pointer block">
                      <div className="text-center">
                        <Music size={32} className="mx-auto mb-2 text-foreground/40" />
                        <p className="text-sm font-medium">Click to select audio</p>
                        <p className="text-xs text-foreground/50 mt-1">Supported: MP3, WAV, OGG, M4A</p>
                      </div>
                    </label>
                  </div>
                  {audio ? (
                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                      <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                        ✓ {audio.name}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Video */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Film size={20} className="text-red-600" />
                    <label className="text-sm font-semibold">Video File (Optional)</label>
                  </div>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-red-600/50 transition">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideo(e.target.files?.[0] || null)}
                      disabled={loading}
                      className="hidden"
                      id="video-input"
                    />
                    <label htmlFor="video-input" className="cursor-pointer block">
                      <div className="text-center">
                        <Film size={32} className="mx-auto mb-2 text-foreground/40" />
                        <p className="text-sm font-medium">Click to select video</p>
                        <p className="text-xs text-foreground/50 mt-1">Supported: MP4, WebM, MOV, AVI</p>
                      </div>
                    </label>
                  </div>
                  {video ? (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        ✓ {video.name}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>

            {/* Status Messages */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-200">Upload Error</p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-200">Success!</p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Artwork uploaded successfully and is now visible in the museum.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
                className="px-8 h-11"
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-8 h-11"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Artwork
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
