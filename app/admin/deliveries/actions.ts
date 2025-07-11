'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { DeliverySchema } from './schema'

export async function addDelivery(formData: FormData) {
  const supabase = await createSupabaseServerClient()

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
  const supabase = await createSupabaseServerClient()

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
  const supabase = await createSupabaseServerClient()

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
  const supabase = await createSupabaseServerClient()

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
