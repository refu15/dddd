'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useFormStatus } from "react-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"

import { DeliverySchema } from "./actions"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

// フォームの入力値の型をスキーマから推論
type DeliveryFormValues = z.infer<typeof DeliverySchema>

// 送信ボタン（サーバー処理中のローディング状態をハンドリング）
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "保存中..." : children}
    </Button>
  )
}

interface DeliveryFormProps {
  action: (formData: FormData) => Promise<any>
  initialData?: DeliveryFormValues | null
  submitButtonText?: string
}

export function DeliveryForm({ action, initialData, submitButtonText = "案件を保存" }: DeliveryFormProps) {
  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(DeliverySchema),
    defaultValues: initialData || {
      title: "",
      customer_name: "",
      delivery_address: "",
      scheduled_at: null,
      status: "pending",
      assigned_driver_id: null,
      assigned_vehicle_id: null,
      base_charge: 0,
      distance_charge: 0,
      weight_charge: 0,
      item_count_charge: 0,
      invoice_status: "unbilled",
      billed_at: null,
      paid_at: null,
      notes: "",
    },
  })

  const [drivers, setDrivers] = useState<{ id: string; name: string }[]>([])
  const [vehicles, setVehicles] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const fetchDrivers = async () => {
      const { data, error } = await supabase.from("users").select("id, name").eq("role", "user")
      if (error) console.error("Error fetching drivers:", error)
      else setDrivers(data || [])
    }

    const fetchVehicles = async () => {
      const { data, error } = await supabase.from("vehicles").select("id, name")
      if (error) console.error("Error fetching vehicles:", error)
      else setVehicles(data || [])
    }

    fetchDrivers()
    fetchVehicles()
  }, [])

  return (
    <Form {...form}>
      <form action={action} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>案件名</FormLabel>
              <FormControl>
                <Input placeholder="〇〇配送案件" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>顧客名</FormLabel>
              <FormControl>
                <Input placeholder="株式会社〇〇" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="delivery_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>配送先住所</FormLabel>
              <FormControl>
                <Input placeholder="東京都〇〇区〇〇" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduled_at"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>配送予定日時</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>日付を選択</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date?.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ステータス</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">保留中</SelectItem>
                  <SelectItem value="in_progress">進行中</SelectItem>
                  <SelectItem value="completed">完了</SelectItem>
                  <SelectItem value="cancelled">キャンセル</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assigned_driver_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>担当ドライバー</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="ドライバーを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assigned_vehicle_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>担当車両</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="車両を選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="base_charge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>基本料金</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="distance_charge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>距離料金</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight_charge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>重量料金</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="item_count_charge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>個数料金</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="invoice_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>請求ステータス</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="請求ステータスを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unbilled">未請求</SelectItem>
                  <SelectItem value="billed">請求済み</SelectItem>
                  <SelectItem value="paid">入金済み</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備考</FormLabel>
              <FormControl>
                <Textarea placeholder="案件に関するメモ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton>{submitButtonText}</SubmitButton>
      </form>
    </Form>
  )
}
