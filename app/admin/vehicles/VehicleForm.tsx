'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useFormStatus } from "react-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { VehicleSchema } from "./schema"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// フォームの入力値の型をスキーマから推論
type VehicleFormValues = z.infer<typeof VehicleSchema>

// 送信ボタン（サーバー処理中のローディング状態をハンドリング）
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "保存中..." : children}
    </Button>
  )
}

interface VehicleFormProps {
  action: (formData: FormData) => Promise<any>
  initialData?: VehicleFormValues | null
  submitButtonText?: string
}

export function VehicleForm({ action, initialData, submitButtonText = "車両を保存" }: VehicleFormProps) {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(VehicleSchema),
    defaultValues: initialData || {
      name: "",
      license_plate: "",
      status: "available",
      notes: "",
      inspection_due_date: null,
      last_maintenance_date: null,
    },
  })

  return (
    <Form {...form}>
      <form action={action} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>車両名</FormLabel>
              <FormControl>
                <Input placeholder="日野デュトロ 1号車" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="license_plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ナンバープレート</FormLabel>
              <FormControl>
                <Input placeholder="品川 100 あ 12-34" {...field} />
              </FormControl>
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
                  <SelectItem value="available">空き</SelectItem>
                  <SelectItem value="in_use">運行中</SelectItem>
                  <SelectItem value="maintenance">整備中</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inspection_due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>車検満了日</FormLabel>
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
                        format(new Date(field.value), "PPP", {})
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備考</FormLabel>
              <FormControl>
                <Textarea placeholder="この車両に関するメモ..." {...field} />
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
