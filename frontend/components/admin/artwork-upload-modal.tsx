"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

const getBackendUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
}

interface ArtworkUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ArtworkUploadModal({
  open,
  onOpenChange,
  onSuccess,
}: ArtworkUploadModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Metadata fields
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [year, setYear] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")

  // Media files
  const [images, setImages] = useState<FileList | null>(null)
  const [model3d, setModel3d] = useState<File | null>(null)
  const [audio, setAudio] = useState<File | null>(null)
  const [video, setVideo] = useState("")

  const handleReset = () => {
    setTitle("")
    setArtist("")
    setYear("")
    setDescription("")
    setTags("")
    setImages(null)
    setModel3d(null)
    setAudio(null)
    setVideo("")
    setError("")
    setSuccess(false)
  }

  const handleClose = () => {
    handleReset()
    onOpenChange(false)
  }

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

      // Add image files
      Array.from(images).forEach((file) => {
        formData.append("images", file)
      })

      // Add optional files
      if (model3d) formData.append("model3d", model3d)
      if (audio) formData.append("audio", audio)
      if (video.trim()) formData.append("video", video)

      // Send to backend
      const backendUrl = getBackendUrl()
      const response = await fetch(`${backendUrl}/api/admin/artwork-upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Upload failed")
      }

      setSuccess(true)
      setTimeout(() => {
        handleClose()
        onSuccess?.()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "An error occurred during upload")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Artwork</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metadata Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Artwork Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  placeholder="Artwork title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Artist *</label>
                <Input
                  placeholder="Artist name"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year *</label>
                <Input
                  placeholder="Year created"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Input
                  placeholder="painting, sculpture, modern (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                placeholder="Detailed description of the artwork"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                disabled={loading}
              />
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Media Files</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Images *</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
                disabled={loading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500">
                {images?.length || 0} file(s) selected
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">3D Model (Optional)</label>
              <input
                type="file"
                accept=".glb,.gltf"
                onChange={(e) => setModel3d(e.target.files?.[0] || null)}
                disabled={loading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500">
                {model3d?.name || "No file selected"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Audio Guide (Optional)</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudio(e.target.files?.[0] || null)}
                disabled={loading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500">
                {audio?.name || "No file selected"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Video Link (Optional)</label>
              <Input
                placeholder="https://vimeo.com/... or https://youtube.com/..."
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">Vimeo or YouTube link</p>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Artwork uploaded successfully!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Artwork"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
