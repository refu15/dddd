'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

// Zodを使用して、入力データのバリデーションスキーマを定義
export const VehicleSchema = z.object({
  name: z.string().min(1, '車両名は必須です。'),
  license_plate: z.string().optional(),
  status: z.enum(['available', 'in_use', 'maintenance']),
  // 日付は文字列として受け取り、後で変換
  inspection_due_date: z.string().optional().nullable(),
  last_maintenance_date: z.string().optional().nullable(),
  notes: z.string().optional(),
})

export async function addVehicle(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const validatedFields = VehicleSchema.safeParse({
    name: formData.get('name'),
    license_plate: formData.get('license_plate'),
    status: formData.get('status'),
    inspection_due_date: formData.get('inspection_due_date'),
    last_maintenance_date: formData.get('last_maintenance_date'),
    notes: formData.get('notes'),
  })

  // バリデーションが失敗した場合
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '入力内容に誤りがあります。',
    }
  }

  // データベースに挿入
  const { error } = await supabase
    .from('vehicles')
    .insert([{
        ...validatedFields.data,
        // 文字列の日付をDateオブジェクトに変換（空の場合はnull）
        inspection_due_date: validatedFields.data.inspection_due_date ? new Date(validatedFields.data.inspection_due_date) : null,
        last_maintenance_date: validatedFields.data.last_maintenance_date ? new Date(validatedFields.data.last_maintenance_date) : null,
    }])

  if (error) {
    console.error('Error adding vehicle:', error)
    return {
        message: 'データベースエラー: 車両の追加に失敗しました。'
    }
  }

  // 成功した場合、車両一覧ページのキャッシュをクリアして最新の状態を再取得させる
  revalidatePath('/admin/vehicles')
  // 車両一覧ページにリダイレクト
  redirect('/admin/vehicles')
}

export async function updateVehicle(id: string, formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const validatedFields = VehicleSchema.safeParse({
    name: formData.get('name'),
    license_plate: formData.get('license_plate'),
    status: formData.get('status'),
    inspection_due_date: formData.get('inspection_due_date'),
    last_maintenance_date: formData.get('last_maintenance_date'),
    notes: formData.get('notes'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容に誤りがあります。",
    }
  }

  const { error } = await supabase
    .from("vehicles")
    .update({
        ...validatedFields.data,
        inspection_due_date: validatedFields.data.inspection_due_date ? new Date(validatedFields.data.inspection_due_date) : null,
        last_maintenance_date: validatedFields.data.last_maintenance_date ? new Date(validatedFields.data.last_maintenance_date) : null,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating vehicle:", error)
    return {
      message: "データベースエラー: 車両の更新に失敗しました。",
    }
  }

  revalidatePath("/admin/vehicles")
  revalidatePath(`/admin/vehicles/${id}/edit`)
  redirect("/admin/vehicles")
}

export async function deleteVehicle(id: string) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting vehicle:', error)
    return {
        message: 'データベースエラー: 車両の削除に失敗しました。'
    }
  }

  revalidatePath('/admin/vehicles')
  redirect('/admin/vehicles') // Redirect to list after deletion
}
