import { Header } from "@/app/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { VehicleForm } from "../../VehicleForm";
import { updateVehicle } from "../../actions";

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: vehicle, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !vehicle) {
    console.error("Error fetching vehicle for edit:", error);
    notFound(); // またはエラーメッセージ付きでリストページにリダイレクト
  }

  // initialDataとして渡すために、DateオブジェクトをISO文字列に変換
  const initialData = {
    ...vehicle,
    inspection_due_date: vehicle.inspection_due_date ? new Date(vehicle.inspection_due_date).toISOString() : null,
    last_maintenance_date: vehicle.last_maintenance_date ? new Date(vehicle.last_maintenance_date).toISOString() : null,
  };

  return (
    <div>
      <Header title="車両の編集" showBackButton backUrl="/admin/vehicles" />
      <main className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>車両情報の編集</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleForm
              action={updateVehicle.bind(null, vehicle.id)}
              initialData={initialData}
              submitButtonText="変更を保存"
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
