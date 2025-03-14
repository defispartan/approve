import { BatchSupplyView } from "./BatchSupplyView";
import { SupplyView } from "./SupplyView";
import { SupplyWithPermitView } from "./SupplyWithPermitView";

export function Body() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <SupplyView />
            <SupplyWithPermitView />
            <BatchSupplyView />
        </div>
    )
}