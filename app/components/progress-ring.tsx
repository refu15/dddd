"use client"

import { useEffect, useState } from "react"

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
}

export function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  color = "#1C3D5A",
  backgroundColor = "#E5E7EB",
}: ProgressRingProps) {
  const [offset, setOffset] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference
    setOffset(progressOffset)
  }, [progress, circumference])

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={backgroundColor}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="transparent"
        className="transition-all duration-500 ease-in-out"
      />
    </svg>
  )
}

