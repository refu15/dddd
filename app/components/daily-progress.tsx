"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ProgressRing } from "./progress-ring"

interface DailyProgressProps {
  totalDeliveries: number
  completedDeliveries: number
}

export function DailyProgress({ totalDeliveries, completedDeliveries }: DailyProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const percentage = totalDeliveries > 0 ? Math.round((completedDeliveries / totalDeliveries) * 100) : 0

    // アニメーション効果のために徐々に値を上げる
    const timer = setTimeout(() => {
      setProgress(percentage)
    }, 300)

    return () => clearTimeout(timer)
  }, [totalDeliveries, completedDeliveries])

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4 flex items-center">
        <div className="relative">
          <ProgressRing progress={progress} size={70} strokeWidth={6} color="#1C3D5A" backgroundColor="#E5E7EB" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-lg font-bold">{progress}%</span>
          </div>
        </div>

        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-600">本日の配送</h3>
          <p className="text-lg font-bold">
            {completedDeliveries} / {totalDeliveries} <span className="text-sm font-normal text-gray-500">件</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

