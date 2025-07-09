import { Header } from "@/app/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DeliveryForm } from "../../DeliveryForm";
import { updateDelivery } from "../../actions";

export default async function EditDeliveryPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: delivery, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !delivery) {
    console.error("Error fetching delivery for edit:", error);
    notFound(); // またはエラーメッセージ付きでリストページにリダイレクト
  }

  // initialDataとして渡すために、DateオブジェクトをISO文字列に変換
  const initialData = {
    ...delivery,
    scheduled_at: delivery.scheduled_at ? new Date(delivery.scheduled_at).toISOString() : null,
    billed_at: delivery.billed_at ? new Date(delivery.billed_at).toISOString() : null,
    paid_at: delivery.paid_at ? new Date(delivery.paid_at).toISOString() : null,
    // 数値フィールドがDBから文字列として返される場合があるため、数値に変換
    base_charge: parseFloat(delivery.base_charge as any),
    distance_charge: parseFloat(delivery.distance_charge as any),
    weight_charge: parseFloat(delivery.weight_charge as any),
    item_count_charge: parseFloat(delivery.item_count_charge as any),
  };

  return (
    <div>
      <Header title="案件の編集" showBackButton backUrl="/admin/deliveries" />
      <main className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>案件情報の編集</CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryForm
              action={updateDelivery.bind(null, delivery.id)}
              initialData={initialData}
              submitButtonText="変更を保存"
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
