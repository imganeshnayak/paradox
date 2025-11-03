"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"

interface Viewer3DProps {
  artwork: any
}

export function Viewer3D({ artwork }: Viewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const rotationRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const initThree = async () => {
      try {
        const THREE = (await import("three")).default
        const canvas = canvasRef.current
        if (!canvas) return

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf5f1e8)

        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
        camera.position.z = 3

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)

        // Create a rotating cube representing the artwork
        const geometry = new THREE.BoxGeometry(2, 2, 2)
        const texture = new THREE.CanvasTexture(
          (() => {
            const c = document.createElement("canvas")
            c.width = 512
            c.height = 512
            const ctx = c.getContext("2d")
            if (ctx) {
              ctx.fillStyle = "#DAA520"
              ctx.fillRect(0, 0, 512, 512)
              ctx.fillStyle = "#8B4513"
              ctx.font = "bold 48px serif"
              ctx.textAlign = "center"
              ctx.fillText(artwork.title, 256, 200)
              ctx.font = "32px serif"
              ctx.fillText(artwork.artist, 256, 280)
            }
            return c
          })(),
        )
        const material = new THREE.MeshPhongMaterial({ map: texture })
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)

        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(5, 5, 5)
        scene.add(light)

        scene.add(new THREE.AmbientLight(0xffffff, 0.5))

        const handleMouseMove = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect()
          rotationRef.current.y = ((e.clientX - rect.left) / rect.width) * Math.PI * 2
          rotationRef.current.x = ((e.clientY - rect.top) / rect.height) * Math.PI * 2
        }

        canvas.addEventListener("mousemove", handleMouseMove)

        const animate = () => {
          requestAnimationFrame(animate)
          cube.rotation.x = rotationRef.current.x
          cube.rotation.y = rotationRef.current.y
          renderer.render(scene, camera)
        }

        animate()
        setIsLoading(false)

        return () => {
          canvas.removeEventListener("mousemove", handleMouseMove)
          renderer.dispose()
          geometry.dispose()
          material.dispose()
        }
      } catch (error) {
        console.log("[v0] 3D viewer initialization skipped")
        setIsLoading(false)
      }
    }

    initThree()
  }, [artwork])

  const handleReset = () => {
    rotationRef.current = { x: 0, y: 0 }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-serif font-bold text-foreground">3D Artwork Viewer</h3>
          <p className="text-sm text-foreground/60">Move your mouse to rotate the artwork</p>
        </div>
        <Button onClick={handleReset} variant="outline" size="sm">
          <RotateCw size={16} className="mr-2" />
          Reset
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full aspect-video bg-gradient-to-br from-background to-card rounded-lg border border-border"
      />

      {isLoading && (
        <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
          <div className="text-foreground/60">Loading 3D viewer...</div>
        </div>
      )}
    </div>
  )
}
