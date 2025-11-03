"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef } from "react"
import VimeoBG from "./vimeo-bg"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadLottie = async () => {
      try {
        const lottie = (await import("lottie-web")).default
        if (containerRef.current) {
          lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "https://lottie.host/d4f1e8b1-5c2d-4b8e-9f3a-2d1c5e9f7b3a/animation.json",
          })
        }
      } catch (error) {
        console.log("[v0] Lottie animation loading skipped")
      }
    }

    loadLottie()
  }, [])

  return (
    <section
      className="relative overflow-hidden h-[38vh] sm:h-[42vh] md:h-screen lg:min-h-screen w-full transition-all duration-300"
    >
      {/* Vimeo background */}
      <VimeoBG />
      {/* Dark overlay for text visibility */}
      <div className="absolute inset-0 bg-black/35 z-5"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 md:w-72 h-48 md:h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 text-center relative z-10 h-full flex flex-col justify-end sm:justify-center items-center md:max-w-6xl md:mx-auto pb-8 sm:pb-0">
        <div ref={containerRef} className="w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 mx-auto mb-3 sm:mb-3 md:mb-6 drop-shadow-lg hidden sm:block"></div>

        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 sm:mb-5 md:mb-8 text-balance leading-tight drop-shadow-xl animate-fade-in max-w-[90%] md:max-w-[80%]">
          Discover Art Like Never Before
        </h1>

        <div className="flex flex-col justify-center">
          <Link href="/explore">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-5 sm:px-6 md:px-10 py-2.5 sm:py-3 md:py-5 text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Start Exploring
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
