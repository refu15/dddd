'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner' // sonnerがトースト表示に使われていると仮定

interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  altitude?: number
  speed?: number
  heading?: number
}

export function LocationTracker() {
  const { data: session } = useSession()
  const [trackingStatus, setTrackingStatus] = useState('停止中')
  const [watchId, setWatchId] = useState<number | null>(null)

  useEffect(() => {
    if (!session?.user) {
      setTrackingStatus('ログインしていません')
      return
    }

    // 'user'ロール（ドライバー）のみを追跡
    // @ts-ignore
    if (session.user.role !== 'user') {
      setTrackingStatus('ドライバーアカウントではありません')
      return
    }

    if (!('geolocation' in navigator)) {
      setTrackingStatus('Geolocation APIが利用できません')
      toast.error('Geolocation APIが利用できません。')
      return
    }

    const sendLocationToServer = async (location: LocationData) => {
      try {
        const response = await fetch('/api/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(location),
        })

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to send location:', errorData.message);
          toast.error(`位置情報の送信に失敗しました: ${errorData.message}`);
        } else {
          console.log('Location sent successfully:', location);
          // toast.success('位置情報を送信しました。'); // トーストが多すぎるためコメントアウト
        }
      } catch (error) {
        console.error('Error sending location:', error);
        toast.error('位置情報の送信中にエラーが発生しました。');
      }
    }

    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy, altitude, speed, heading } = position.coords;
      sendLocationToServer({ latitude, longitude, accuracy, altitude, speed, heading });
      setTrackingStatus(`追跡中: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }

    const errorCallback = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      setTrackingStatus(`エラー: ${error.message}`);
      toast.error(`位置情報の取得に失敗しました: ${error.message}`);
    }

    // 位置情報の監視を開始
    const id = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy: true,
        maximumAge: 0, // キャッシュされた位置情報を使用しない
        timeout: 5000, // 位置情報を取得するまでのタイムアウト
      }
    )
    setWatchId(id)
    setTrackingStatus('追跡開始中...')

    // クリーンアップ関数
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
        setTrackingStatus('追跡停止')
        setWatchId(null)
      }
    }
  }, [session, watchId]) // sessionまたはwatchIdが変更された場合にエフェクトを再実行

  return (
    <div className="p-2 text-sm text-gray-600 bg-gray-50 rounded-md flex items-center justify-between">
      <span>位置情報追跡: {trackingStatus}</span>
      {/* 必要に応じて、手動で追跡を停止/開始するボタンを追加 */}
    </div>
  )
}
