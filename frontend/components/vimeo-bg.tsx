"use client"

import React from "react"

type Props = {
  src?: string
}

export default function VimeoBG({
  src = "/bg.mp4",
}: Props) {
  return (
    <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none">
      <video
        src={src}
        className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 object-cover"
        style={{ 
          aspectRatio: '16/9',
          minWidth: '100%',
          minHeight: '100%',
          width: '100%',
          height: '100%'
        }}
        autoPlay
        loop
        muted
        playsInline
        title="Background video"
        aria-hidden="true"
      />
    </div>
  )
}
