import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Permit } from "../actions/Permit";
import { SupplyWithPermit } from "../actions/SupplyWithPermit";

export function SupplyWithPermitView() {

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Supply With Permit</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Permit />
                <SupplyWithPermit />
            </CardContent>
    </Card>
  )
}
