'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Zod schema for validation
export export const DeliverySchema = z.object({
  title: z.string().min(1, '案件名は必須です。'),
  customer_name: z.string().min(1, '顧客名は必須です。'),
  delivery_address: z.string().min(1, '配送先住所は必須です。'),
  scheduled_at: z.string().optional().nullable(), // Date as string
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  assigned_driver_id: z.string().uuid().optional().nullable(), // UUID for user
  assigned_vehicle_id: z.string().uuid().optional().nullable(), // UUID for vehicle

  base_charge: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, '基本料金は0以上である必要があります。')
  ).optional().default(0),
  distance_charge: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, '距離料金は0以上である必要があります。')
  ).optional().default(0),
  weight_charge: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, '重量料金は0以上である必要があります。')
  ).optional().default(0),
  item_count_charge: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().min(0, '個数料金は0以上である必要があります。')
  ).optional().default(0),

  invoice_status: z.enum(['unbilled', 'billed', 'paid']).optional().default('unbilled'),
  billed_at: z.string().optional().nullable(), // Date as string
  paid_at: z.string().optional().nullable(), // Date as string

  notes: z.string().optional(),
})

export async function addDelivery(formData: FormData) {
  const supabase = createSupabaseServerClient()

  const validatedFields = DeliverySchema.safeParse({
    title: formData.get('title'),
    customer_name: formData.get('customer_name'),
    delivery_address: formData.get('delivery_address'),
    scheduled_at: formData.get('scheduled_at'),
    status: formData.get('status'),
    assigned_driver_id: formData.get('assigned_driver_id') || null,
    assigned_vehicle_id: formData.get('assigned_vehicle_id') || null,
    base_charge: formData.get('base_charge'),
    distance_charge: formData.get('distance_charge'),
    weight_charge: formData.get('weight_charge'),
    item_count_charge: formData.get('item_count_charge'),
    invoice_status: formData.get('invoice_status'),
    billed_at: formData.get('billed_at'),
    paid_at: formData.get('paid_at'),
    notes: formData.get('notes'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '入力内容に誤りがあります。',
    }
  }

  const { error } = await supabase
    .from('deliveries')
    .insert([{
        ...validatedFields.data,
        scheduled_at: validatedFields.data.scheduled_at ? new Date(validatedFields.data.scheduled_at) : null,
        billed_at: validatedFields.data.billed_at ? new Date(validatedFields.data.billed_at) : null,
        paid_at: validatedFields.data.paid_at ? new Date(validatedFields.data.paid_at) : null,
    }])

  if (error) {
    console.error('Error adding delivery:', error)
    return {
        message: 'データベースエラー: 案件の追加に失敗しました。'
    }
  }

  revalidatePath('/admin/deliveries')
  redirect('/admin/deliveries')
}

export async function updateDelivery(id: string, formData: FormData) {
  const supabase = createSupabaseServerClient()

  const validatedFields = DeliverySchema.safeParse({
    title: formData.get('title'),
    customer_name: formData.get('customer_name'),
    delivery_address: formData.get('delivery_address'),
    scheduled_at: formData.get('scheduled_at'),
    status: formData.get('status'),
    assigned_driver_id: formData.get('assigned_driver_id') || null,
    assigned_vehicle_id: formData.get('assigned_vehicle_id') || null,
    base_charge: formData.get('base_charge'),
    distance_charge: formData.get('distance_charge'),
    weight_charge: formData.get('weight_charge'),
    item_count_charge: formData.get('item_count_charge'),
    invoice_status: formData.get('invoice_status'),
    billed_at: formData.get('billed_at'),
    paid_at: formData.get('paid_at'),
    notes: formData.get('notes'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '入力内容に誤りがあります。',
    }
  }

  const { error } = await supabase
    .from('deliveries')
    .update({
        ...validatedFields.data,
        scheduled_at: validatedFields.data.scheduled_at ? new Date(validatedFields.data.scheduled_at) : null,
        billed_at: validatedFields.data.billed_at ? new Date(validatedFields.data.billed_at) : null,
        paid_at: validatedFields.data.paid_at ? new Date(validatedFields.data.paid_at) : null,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating delivery:', error)
    return {
        message: 'データベースエラー: 案件の更新に失敗しました。'
    }
  }

  revalidatePath('/admin/deliveries')
  revalidatePath(`/admin/deliveries/${id}/edit`)
  redirect('/admin/deliveries')
}

export async function deleteDelivery(id: string) {
  const supabase = createSupabaseServerClient()

  const { error } = await supabase
    .from('deliveries')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting delivery:', error)
    return {
        message: 'データベースエラー: 案件の削除に失敗しました。'
    }
  }

  revalidatePath('/admin/deliveries')
  redirect('/admin/deliveries')
}

export async function updateInvoiceStatus(id: string, newStatus: 'unbilled' | 'billed' | 'paid') {
  const supabase = createSupabaseServerClient()

  const { error } = await supabase
    .from('deliveries')
    .update({
        invoice_status: newStatus,
        billed_at: newStatus === 'billed' ? new Date().toISOString() : null,
        paid_at: newStatus === 'paid' ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating invoice status:', error)
    return {
        message: 'データベースエラー: 請求ステータスの更新に失敗しました。'
    }
  }

  revalidatePath('/admin/deliveries')
  revalidatePath(`/admin/deliveries/${id}`) // Revalidate details page if exists
  redirect('/admin/deliveries')
}
