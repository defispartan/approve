import { Button } from "@/components/ui/button";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect } from "react";
import { useTokenContext } from "../state/TokenProvider";
import { IERC20_ABI } from "@bgd-labs/aave-address-book/abis";

export function Revoke() {
const {address} = useAccount();
const { updateTokenAllowance, tokenAllowance } = useTokenContext();


const {
  writeContract: revoke,
  data: hash
} = useWriteContract();

const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    updateTokenAllowance();
  },[isConfirmed])

const revokeAllowance = async () => {
  await revoke({
    address: AaveV3Sepolia.ASSETS.USDC.UNDERLYING,
    abi: IERC20_ABI,
    functionName: "approve",
    args: [AaveV3Sepolia.POOL, BigInt(0)],
  });
  }

    return ( <Button onClick={revokeAllowance} disabled={!address || isConfirming || tokenAllowance === BigInt(0)} className="w-full cursor-pointer mt-5">
    {isConfirming ? "Revoking..." :"Revoke Allowance"}
  </Button>)
}