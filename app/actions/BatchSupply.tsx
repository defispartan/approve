import { Button } from "@/components/ui/button";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { useAccount } from "wagmi";
import { useTokenContext } from "../state/TokenProvider";
import { IERC20_ABI, IPool_ABI } from "@bgd-labs/aave-address-book/abis";
import { useSendCalls } from 'wagmi/experimental'
import { encodeFunctionData, maxUint256 } from "viem";

export function BatchSupply() {
const {address} = useAccount();
const { refreshData, tokenBalance } = useTokenContext();
const { sendCalls, isPending } = useSendCalls({
    mutation: {
        onSuccess: hash => {
            console.log("BATCH HASH", hash )
            refreshData();
        },
        onError: error => {
            console.log("ERROR", error)
        }
    }
})

const handleSupply = async () => {
  const approveData = encodeFunctionData({
    abi: IERC20_ABI,
    functionName: 'approve',
    args: [AaveV3Sepolia.POOL,maxUint256]
  });
  const supplyData = encodeFunctionData({
    abi: IPool_ABI,
    functionName: 'supply',
    args: [AaveV3Sepolia.ASSETS.USDC.UNDERLYING, tokenBalance, address || '0x0', 0]
  });
    sendCalls({
      calls: [ {
          to: AaveV3Sepolia.ASSETS.USDC.UNDERLYING,
          data: approveData,
        },
        {
          to: AaveV3Sepolia.POOL,
          data: supplyData,
        },]
  })
  }
  return ( <Button onClick={handleSupply} disabled={!address || isPending || tokenBalance === BigInt(0)} className="cursor-pointer">
  {isPending ? "Supplying..." :"Supply"}
  </Button>)
}
