'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface MapDisplayProps {
  apiKey: string
}

interface Location {
  id: string
  created_at: string
  user_id: string
  latitude: number
  longitude: number
  accuracy: number | null
  altitude: number | null
  speed: number | null
  heading: number | null
}

interface User {
  id: string
  name: string
  email: string
}

export function MapDisplay({ apiKey }: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMap = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map()) // user_idごとにマーカーを保存するMap
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const [users, setUsers] = useState<Map<string, User>>(new Map()) // idごとにユーザーを保存するMap

  useEffect(() => {
    const loadMap = async () => {
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['maps'],
      })

      try {
        await loader.load()

        if (mapRef.current) {
          const initialMapOptions: google.maps.MapOptions = {
            center: { lat: 35.6895, lng: 139.6917 }, // デフォルトは東京
            zoom: 10,
          }
          googleMap.current = new google.maps.Map(mapRef.current, initialMapOptions)
          infoWindowRef.current = new google.maps.InfoWindow()
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        toast.error('Google Mapsの読み込みに失敗しました。')
      }
    }

    loadMap()
  }, [apiKey])

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    // ユーザー名を取得するためにすべてのユーザーをフェッチ
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, name, email')
      if (error) {
        console.error('Error fetching users:', error)
        toast.error('ユーザー情報の取得に失敗しました。')
        return
      }
      const usersMap = new Map<string, User>()
      data.forEach((user: User) => usersMap.set(user.id, user))
      setUsers(usersMap)
    }
    fetchUsers()

    // 過去の位置情報をフェッチ
    const fetchHistoricalLocations = async () => {
      const { data, error } = await supabase.from('locations').select('*')
      if (error) {
        console.error('Error fetching historical locations:', error)
        toast.error('過去の位置情報の取得に失敗しました。')
        return
      }
      data.forEach((location: Location) => updateMarker(location))
    }
    fetchHistoricalLocations()

    // リアルタイム購読を設定
    const channel = supabase
      .channel('locations_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'locations' },
        (payload) => {
          const newLocation = payload.new as Location
          updateMarker(newLocation)
          toast.success(`新しい位置情報: ${users.get(newLocation.user_id)?.name || '不明なユーザー'}`);
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [users]) // ユーザーデータが利用可能になったときに再実行

  const updateMarker = (location: Location) => {
    if (!googleMap.current) return

    const position = { lat: location.latitude, lng: location.longitude }
    const userId = location.user_id
    const userName = users.get(userId)?.name || '不明なユーザー'
    const userEmail = users.get(userId)?.email || 'N/A'

    let marker = markersRef.current.get(userId)

    if (marker) {
      // 既存のマーカーの位置を更新
      marker.setPosition(position)
    } else {
      // 新しいマーカーを作成
      marker = new google.maps.Marker({
        position: position,
        map: googleMap.current,
        title: userName,
      })
      markersRef.current.set(userId, marker)
    }

    // マーカーにクリックリスナーを追加
    marker.addListener('click', () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(`
          <div>
            <strong>${userName}</strong><br/>
            Email: ${userEmail}<br/>
            最終更新: ${new Date(location.created_at).toLocaleString()}<br/>
            緯度: ${location.latitude.toFixed(4)}<br/>
            経度: ${location.longitude.toFixed(4)}
          </div>
        `)
        infoWindowRef.current.open(googleMap.current, marker)
      }
    })
  }

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
