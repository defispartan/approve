import { Button } from "@/components/ui/button";
import { useTokenContext } from "../state/TokenProvider";

export function ClearSignature() {
const { setSignature, signature } = useTokenContext();


    return ( <Button onClick={() => setSignature(undefined)}  disabled={!signature} className="w-full cursor-pointer mt-5">
    Clear Signature
  </Button>)
}