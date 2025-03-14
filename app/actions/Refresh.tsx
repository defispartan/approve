import { Button } from "@/components/ui/button";
import { useTokenContext } from "../state/TokenProvider";
import { useAccount } from "wagmi";

export function Refresh() {
  const {address} = useAccount();
const { refreshData } = useTokenContext();


    return ( <Button onClick={refreshData} disabled={!address} className="w-full cursor-pointer mt-5">
    Refresh Data
  </Button>)
}