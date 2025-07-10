'use client'

import { useEffect, useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { LogIn, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  checkIn,
  checkOut,
  requestDirectGo,
  requestDirectReturn,
} from '@/app/actions/attendance'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  altitude?: number
  speed?: number
  heading?: number
}

export function AttendanceButtons() {
  const { data: session } = useSession()
  const [attendanceStatus, setAttendanceStatus] = useState<'never-checked-in' | 'check_in' | 'check_out' | 'direct_go' | 'direct_return'>('never-checked-in')
  const [isPending, startTransition] = useTransition()
  const [isDirectGoDialogOpen, setIsDirectGoDialogOpen] = useState(false)
  const [isDirectReturnDialogOpen, setIsDirectReturnDialogOpen] = useState(false)
  const [notes, setNotes] = useState('')

  const supabase = createSupabaseBrowserClient()

  // ユーザーの最新の勤怠状態を取得
  useEffect(() => {
    if (!session?.user?.id) return

    const fetchLastAttendance = async () => {
      const { data, error } = await supabase
        .from('attendances')
        .select('attendance_type')
        .eq('user_id', session.user.id)
        .order('recorded_at', { ascending: false })
        .maybeSingle()

      if (error) {
        console.error('Error fetching last attendance:', error)
        return
      }

      if (data) {
        const lastType = data.attendance_type
        setAttendanceStatus(lastType)
      } else {
        setAttendanceStatus('never-checked-in')
      }
    }

    fetchLastAttendance()
  }, [session, supabase])

  const getLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation APIが利用できません。'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy, altitude, speed, heading } = position.coords
          resolve({ latitude, longitude, accuracy, altitude, speed, heading })
        },
        (error) => {
          reject(new Error(`位置情報の取得に失敗しました: ${error.message}`))
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }

  const handleAttendance = async (type: 'in' | 'out') => {
    if (!session?.user?.id) {
      toast.error('ログインしていません。')
      return
    }

    startTransition(async () => {
      try {
        const location = await getLocation()
        let result
        if (type === 'in') {
          result = await checkIn(location)
        } else {
          result = await checkOut(location)
        }

        if (result?.message) {
          toast.success(result.message)
          setAttendanceStatus(type === 'in' ? 'check_in' : 'check_out')
        } else {
          toast.error('操作に失敗しました。')
        }
      } catch (error: any) {
        toast.error(error.message)
      }
    })
  }

  const handleDirectRequest = async (type: 'go' | 'return') => {
    if (!session?.user?.id) {
      toast.error('ログインしていません。')
      return
    }

    startTransition(async () => {
      try {
        const location = await getLocation()
        let result
        if (type === 'go') {
          result = await requestDirectGo(location, notes)
        } else {
          result = await requestDirectReturn(location, notes)
        }

        if (result?.message) {
          toast.success(result.message)
          setIsDirectGoDialogOpen(false)
          setIsDirectReturnDialogOpen(false)
          setNotes('')
          setAttendanceStatus(type === 'go' ? 'direct_go' : 'direct_return') // 直行の場合は出勤状態にする
        } else {
          toast.error('申請に失敗しました。')
        }
      } catch (error: any) {
        toast.error(error.message)
      }
    })
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {attendanceStatus === 'check_out' || attendanceStatus === 'never-checked-in' || attendanceStatus === 'direct_return' ? (
          <Button
            className="h-14 w-full text-lg bg-white border-2 border-[#1C3D5A] text-[#1C3D5A] hover:bg-gray-50"
            onClick={() => handleAttendance('in')}
            disabled={isPending}
          >
            <LogIn className="mr-2 h-6 w-6" />
            出勤
          </Button>
        ) : (
          <Button
            className="h-14 w-full text-lg bg-white border-2 border-red-500 text-red-500 hover:bg-gray-50"
            onClick={() => handleAttendance('out')}
            disabled={isPending}
          >
            <LogOut className="mr-2 h-6 w-6" />
            退勤
          </Button>
        )}
        {attendanceStatus === 'check_out' || attendanceStatus === 'never-checked-in' || attendanceStatus === 'direct_return' ? (
          <Button
            className="h-14 w-full text-lg bg-white border-2 border-gray-400 text-gray-700 hover:bg-gray-50"
            onClick={() => setIsDirectGoDialogOpen(true)}
            disabled={isPending}
          >
            直行申請
          </Button>
        ) : (
          <Button
            className="h-14 w-full text-lg bg-white border-2 border-gray-400 text-gray-700 hover:bg-gray-50"
            onClick={() => setIsDirectReturnDialogOpen(true)}
            disabled={isPending}
          >
            直帰申請
          </Button>
        )}
      </div>

      {/* 直行申請ダイアログ */}
      <Dialog open={isDirectGoDialogOpen} onOpenChange={setIsDirectGoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>直行申請</DialogTitle>
            <DialogDescription>直行する理由を記入してください。</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="例: 現場へ直行するため"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDirectGoDialogOpen(false)} disabled={isPending}>
              キャンセル
            </Button>
            <Button onClick={() => handleDirectRequest('go')} disabled={isPending}>
              {isPending ? '申請中...' : '申請する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 直帰申請ダイアログ */}
      <Dialog open={isDirectReturnDialogOpen} onOpenChange={setIsDirectReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>直帰申請</DialogTitle>
            <DialogDescription>直帰する理由を記入してください。</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="例: 現場から直帰するため"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDirectReturnDialogOpen(false)} disabled={isPending}>
              キャンセル
            </Button>
            <Button onClick={() => handleDirectRequest('return')} disabled={isPending}>
              {isPending ? '申請中...' : '申請する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
