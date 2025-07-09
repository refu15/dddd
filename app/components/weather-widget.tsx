"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, Sun, CloudSun, Snowflake } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface WeatherData {
  condition: "sunny" | "cloudy" | "rainy" | "partly-cloudy" | "snowy"
  temperature: number
  location: string
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    condition: "partly-cloudy",
    temperature: 22,
    location: "東京",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 実際のアプリでは天気APIを呼び出す
    const fetchWeather = () => {
      setTimeout(() => {
        setWeather({
          condition: "partly-cloudy",
          temperature: 22,
          location: "東京",
        })
        setIsLoading(false)
      }, 1000)
    }

    fetchWeather()
  }, [])

  const renderWeatherIcon = () => {
    switch (weather.condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "partly-cloudy":
        return <CloudSun className="h-8 w-8 text-gray-500" />
      case "snowy":
        return <Snowflake className="h-8 w-8 text-blue-300" />
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-3 flex items-center justify-center">
          <div className="animate-pulse flex space-x-4 w-full">
            <div className="rounded-full bg-gray-100 h-8 w-8"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center">
          {renderWeatherIcon()}
          <div className="ml-3">
            <p className="text-sm font-medium">{weather.location}</p>
            <p className="text-xs text-gray-500">現在の天気</p>
          </div>
        </div>
        <div className="text-xl font-bold">{weather.temperature}°C</div>
      </CardContent>
    </Card>
  )
}

