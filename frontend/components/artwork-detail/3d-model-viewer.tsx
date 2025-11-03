"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface Model3DViewerProps {
  modelUrl: string
  title?: string
}

export function Model3DViewer({ modelUrl, title }: Model3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let animationId: number

    const initThree = async () => {
      try {
        // Dynamically import Three.js modules
        const THREE = await import("three")
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js")
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js")

        // Scene setup
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf5f5f5)

        // Camera setup
        const width = containerRef.current!.clientWidth
        const height = containerRef.current!.clientHeight
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        camera.position.set(0, 2, 5)

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        containerRef.current!.appendChild(renderer.domElement)

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(5, 10, 7)
        scene.add(directionalLight)

        // OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.autoRotate = true
        controls.autoRotateSpeed = 4
        controls.enableZoom = true

        // Load 3D model
        const loader = new GLTFLoader()
        loader.load(
          modelUrl,
          (gltf: any) => {
            const model = gltf.scene

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(model)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 4 / maxDim

            model.position.sub(center.multiplyScalar(scale))
            model.scale.multiplyScalar(scale)

            scene.add(model)

            // Adjust camera
            camera.position.z = 5
            controls.target.set(0, 0, 0)
            controls.update()

            setLoading(false)
          },
          (progress: any) => {
            const percentComplete = (progress.loaded / progress.total) * 100
            console.log(percentComplete + "% loaded")
          },
          (error: any) => {
            console.error("Error loading 3D model:", error)
            setError("Failed to load 3D model")
            setLoading(false)
          }
        )

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate)
          controls.update()
          renderer.render(scene, camera)
        }
        animate()

        // Handle window resize
        const handleResize = () => {
          if (!containerRef.current) return
          const newWidth = containerRef.current.clientWidth
          const newHeight = containerRef.current.clientHeight

          camera.aspect = newWidth / newHeight
          camera.updateProjectionMatrix()
          renderer.setSize(newWidth, newHeight)
        }

        window.addEventListener("resize", handleResize)

        // Cleanup function
        return () => {
          window.removeEventListener("resize", handleResize)
          cancelAnimationFrame(animationId)
          if (containerRef.current && renderer.domElement.parentElement === containerRef.current) {
            containerRef.current.removeChild(renderer.domElement)
          }
          renderer.dispose()
        }
      } catch (err) {
        console.error("Error initializing Three.js:", err)
        setError("Failed to initialize 3D viewer")
        setLoading(false)
      }
    }

    const cleanup = initThree()

    return () => {
      cleanup?.then((fn) => fn?.())
    }
  }, [modelUrl])

  return (
    <div ref={containerRef} className="w-full h-full aspect-video rounded-lg overflow-hidden bg-white relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-2" />
            <p className="text-sm text-foreground/60">Loading 3D model...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
