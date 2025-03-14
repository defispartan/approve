import { Button } from "@/components/ui/button";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect } from "react";
import { useTokenContext } from "../state/TokenProvider";
import { IERC20_ABI } from "@bgd-labs/aave-address-book/abis";
import { maxUint256 } from "viem";

export function Approve() {
const {address} = useAccount();
const { updateTokenAllowance, tokenAllowance, tokenBalance } = useTokenContext();


const {
  writeContract: approve,
  data: hash
} = useWriteContract();

const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    updateTokenAllowance();
  },[isConfirmed, updateTokenAllowance])

const approveAllowance = async () => {
  await approve({
    address: AaveV3Sepolia.ASSETS.USDC.UNDERLYING,
    abi: IERC20_ABI,
    functionName: "approve",
    args: [AaveV3Sepolia.POOL, maxUint256],
  });
  }

    return ( <Button onClick={approveAllowance} disabled={!address || isConfirming || tokenAllowance === maxUint256 || tokenBalance === BigInt(0)} className="cursor-pointer">
    {isConfirming ? "Approving..." :"Approve"}
  </Button>)
}