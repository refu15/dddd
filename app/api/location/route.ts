import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: '認証されていません' }, { status: 401 })
  }

  // @ts-ignore
  if (session.user.role !== 'user') {
    return NextResponse.json({ message: 'ドライバーアカウントではありません' }, { status: 403 })
  }

  const { latitude, longitude, accuracy, altitude, speed, heading } = await request.json()

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return NextResponse.json({ message: '無効な位置情報データです' }, { status: 400 })
  }

  const supabase = createSupabaseServerClient()

  const { error } = await supabase.from('locations').insert({
    user_id: session.user.id,
    latitude,
    longitude,
    accuracy,
    altitude,
    speed,
    heading,
  })

  if (error) {
    console.error('Error inserting location:', error)
    return NextResponse.json({ message: '位置情報の保存に失敗しました' }, { status: 500 })
  }

  return NextResponse.json({ message: '位置情報が正常に保存されました' }, { status: 200 })
}
