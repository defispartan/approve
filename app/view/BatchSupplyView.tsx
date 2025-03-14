import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatchSupply } from "../actions/BatchSupply";

export function BatchSupplyView() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Batch Approve and Supply</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-center gap-4">
        <BatchSupply />
      </CardContent>
    </Card>
  );
}
