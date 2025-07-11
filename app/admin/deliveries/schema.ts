import { z } from 'zod'

export const DeliverySchema = z.object({
  title: z.string().min(1, '案件名は必須です。'),
  customer_name: z.string().min(1, '顧客名は必須です。'),
  delivery_address: z.string().min(1, '配送先住所は必須です。'),
  scheduled_at: z.string().optional().nullable(), // Date as string
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  assigned_driver_id: z.string().uuid().optional().nullable(), // UUID for user
  assigned_vehicle_id: z.string().uuid().optional().nullable(), // UUID for vehicle

  base_charge: z.coerce
    .number()
    .min(0, '基本料金は0以上である必要があります。')
    .optional()
    .default(0),
  distance_charge: z.coerce
    .number()
    .min(0, '距離料金は0以上である必要があります。')
    .optional()
    .default(0),
  weight_charge: z.coerce
    .number()
    .min(0, '重量料金は0以上である必要があります。')
    .optional()
    .default(0),
  item_count_charge: z.coerce
    .number()
    .min(0, '個数料金は0以上である必要があります。')
    .optional()
    .default(0),

  invoice_status: z.enum(['unbilled', 'billed', 'paid'])
    .optional()
    .default('unbilled'),
  billed_at: z.string().optional().nullable(), // Date as string
  paid_at: z.string().optional().nullable(), // Date as string

  notes: z.string().optional(),
})
