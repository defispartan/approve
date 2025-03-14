import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Approve } from "../actions/Approve";
import { Supply } from "../actions/Supply";

export function SupplyView() {

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Approve & Supply</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Approve />
                <Supply />
            </CardContent>
    </Card>
  )
}
