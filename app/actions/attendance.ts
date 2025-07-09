'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// ヘルパー関数: セッションからユーザーIDを取得
async function getUserId() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.id) {
    throw new Error('認証されていません。')
  }
  return session.user.id
}

// 位置情報データのスキーマ
const LocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional().nullable(),
  altitude: z.number().optional().nullable(),
  speed: z.number().optional().nullable(),
  heading: z.number().optional().nullable(),
})

export async function checkIn(locationData: z.infer<typeof LocationSchema>) {
  const userId = await getUserId()
  const supabase = createSupabaseServerClient()

  const validatedLocation = LocationSchema.safeParse(locationData)
  if (!validatedLocation.success) {
    console.error('Invalid location data:', validatedLocation.error)
    return { message: '位置情報が不正です。' }
  }

  const { error } = await supabase.from('attendances').insert({
    user_id: userId,
    attendance_type: 'check_in',
    recorded_at: new Date().toISOString(),
    ...validatedLocation.data,
  })

  if (error) {
    console.error('Error checking in:', error)
    return { message: '出勤打刻に失敗しました。' }
  }

  revalidatePath('/profile/attendance') // 勤怠ログページを再検証
  return { message: '出勤打刻が完了しました。' }
}

export async function checkOut(locationData: z.infer<typeof LocationSchema>) {
  const userId = await getUserId()
  const supabase = createSupabaseServerClient()

  const validatedLocation = LocationSchema.safeParse(locationData)
  if (!validatedLocation.success) {
    console.error('Invalid location data:', validatedLocation.error)
    return { message: '位置情報が不正です。' }
  }

  const { error } = await supabase.from('attendances').insert({
    user_id: userId,
    attendance_type: 'check_out',
    recorded_at: new Date().toISOString(),
    ...validatedLocation.data,
  })

  if (error) {
    console.error('Error checking out:', error)
    return { message: '退勤打刻に失敗しました。' }
  }

  revalidatePath('/profile/attendance')
  return { message: '退勤打刻が完了しました。' }
}

export async function requestDirectGo(locationData: z.infer<typeof LocationSchema>, notes: string) {
  const userId = await getUserId()
  const supabase = createSupabaseServerClient()

  const validatedLocation = LocationSchema.safeParse(locationData)
  if (!validatedLocation.success) {
    console.error('Invalid location data:', validatedLocation.error)
    return { message: '位置情報が不正です。' }
  }

  const { error } = await supabase.from('attendances').insert({
    user_id: userId,
    attendance_type: 'direct_go',
    recorded_at: new Date().toISOString(),
    notes: notes,
    approval_status: 'pending', // 申請はデフォルトで保留中
    ...validatedLocation.data,
  })

  if (error) {
    console.error('Error requesting direct go:', error)
    return { message: '直行申請に失敗しました。' }
  }

  revalidatePath('/profile/attendance')
  // 管理者承認ページも再検証する可能性あり
  return { message: '直行申請が完了しました。管理者の承認をお待ちください。' }
}

export async function requestDirectReturn(locationData: z.infer<typeof LocationSchema>, notes: string) {
  const userId = await getUserId()
  const supabase = createSupabaseServerClient()

  const validatedLocation = LocationSchema.safeParse(locationData)
  if (!validatedLocation.success) {
    console.error('Invalid location data:', validatedLocation.error)
    return { message: '位置情報が不正です。' }
  }

  const { error } = await supabase.from('attendances').insert({
    user_id: userId,
    attendance_type: 'direct_return',
    recorded_at: new Date().toISOString(),
    notes: notes,
    approval_status: 'pending', // 申請はデフォルトで保留中
    ...validatedLocation.data,
  })

  if (error) {
    console.error('Error requesting direct return:', error)
    return { message: '直帰申請に失敗しました。' }
  }

  revalidatePath('/profile/attendance')
  // 管理者承認ページも再検証する可能性あり
  return { message: '直帰申請が完了しました。管理者の承認をお待ちください。' }
}
