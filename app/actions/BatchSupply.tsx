import { Button } from "@/components/ui/button";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { useAccount, useChainId, useSendCalls } from "wagmi";
import { useTokenContext } from "../state/TokenProvider";
import { IERC20_ABI, IPool_ABI } from "@bgd-labs/aave-address-book/abis";
import { encodeFunctionData, toHex } from "viem";
import { useState } from "react";

const paymasterUrl = process.env.NEXT_PUBLIC_PAYMASTER_URL as string;

export function BatchSupply() {
const {address} = useAccount();
const chainId = useChainId();
const { refreshData, tokenBalance } = useTokenContext();
const [enablePaymaster, setEnablePaymaster] = useState(true);
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
    args: [AaveV3Sepolia.POOL,tokenBalance]
  });
  const supplyData = encodeFunctionData({
    abi: IPool_ABI,
    functionName: 'supply',
    args: [AaveV3Sepolia.ASSETS.AAVE.UNDERLYING, tokenBalance, address || '0x0', 0]
  });
    sendCalls({
      calls: [ {
          to: AaveV3Sepolia.ASSETS.AAVE.UNDERLYING,
          data: approveData,
        },
        {
          to: AaveV3Sepolia.POOL,
          data: supplyData,
        },],
        capabilities: enablePaymaster ? {
          paymasterService: {
            [toHex(chainId)]: {
              optional: true,
              url: paymasterUrl,
            }
          }
        } : undefined
  })
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="paymaster"
          checked={enablePaymaster}
          onChange={(e) => setEnablePaymaster(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="paymaster" className="text-sm">Enable Paymaster</label>
      </div>
      <Button onClick={handleSupply} disabled={!address || isPending || tokenBalance === BigInt(0)} className="cursor-pointer">
        {isPending ? "Supplying..." :"Supply"}
      </Button>
    </div>
  )
}
