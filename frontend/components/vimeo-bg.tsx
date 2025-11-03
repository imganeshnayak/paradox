"use client"

import React from "react"

type Props = {
  src?: string
}

export default function VimeoBG({
  src = "https://player.vimeo.com/video/1128033421?speed=0&pip=0&loop=1&background=1&app_id=122963",
}: Props) {
  return (
    <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
      <iframe
        src={src}
        className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover"
        style={{ 
          aspectRatio: '16/9',
          minWidth: '100%',
          minHeight: '100%',
          width: '100%',
          height: '100%'
        }}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title="Background video"
        aria-hidden="true"
      />
    </div>
  )
}
