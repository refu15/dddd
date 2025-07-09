'use client'

import { useState, useTransition } from 'react'
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { updateInvoiceStatus } from './actions'
import { toast } from 'sonner'

interface UpdateInvoiceStatusButtonProps {
  deliveryId: string
  currentStatus: 'unbilled' | 'billed' | 'paid'
}

export function UpdateInvoiceStatusButton({ deliveryId, currentStatus }: UpdateInvoiceStatusButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (newStatus: 'unbilled' | 'billed' | 'paid') => {
    if (newStatus === currentStatus) return // 変更がない場合は何もしない

    startTransition(async () => {
      const result = await updateInvoiceStatus(deliveryId, newStatus)
      if (result?.message) {
        toast.error(result.message)
      } else {
        toast.success('請求ステータスを更新しました。')
      }
    })
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>請求ステータス変更</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem
          onClick={() => handleStatusChange('unbilled')}
          disabled={currentStatus === 'unbilled' || isPending}
        >
          未請求
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('billed')}
          disabled={currentStatus === 'billed' || isPending}
        >
          請求済み
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('paid')}
          disabled={currentStatus === 'paid' || isPending}
        >
          入金済み
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
