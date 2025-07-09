import { Header } from "@/app/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addVehicle } from "../actions";
import { VehicleForm } from "../VehicleForm";

export default function NewVehiclePage() {
  return (
    <div>
      <Header title="車両の追加" showBackButton backUrl="/admin/vehicles" />
      <main className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>新規車両登録</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleForm 
              action={addVehicle}
              submitButtonText="車両を登録"
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
