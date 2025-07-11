import { z } from 'zod'

export const VehicleSchema = z.object({
  name: z.string().min(1, '車両名は必須です。'),
  license_plate: z.string().optional(),
  status: z.enum(['available', 'in_use', 'maintenance']),
  // 日付は文字列として受け取り、後で変換
  inspection_due_date: z.string().optional().nullable(),
  last_maintenance_date: z.string().optional().nullable(),
  notes: z.string().optional(),
})
