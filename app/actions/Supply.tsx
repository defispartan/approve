import { Button } from "@/components/ui/button";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect } from "react";
import { useTokenContext } from "../state/TokenProvider";
import { IPool_ABI } from "@bgd-labs/aave-address-book/abis";

export function Supply() {
const {address} = useAccount();
const { refreshData, tokenAllowance, tokenBalance } = useTokenContext();


const {
  writeContract: supply,
  data: hash
} = useWriteContract();

const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    refreshData();
  },[isConfirmed])

const handleSupply = async () => {
  await supply({
    address: AaveV3Sepolia.POOL,
    abi: IPool_ABI,
    functionName: "supply",
    args: [AaveV3Sepolia.ASSETS.AAVE.UNDERLYING, tokenBalance, address || '0x0', 0],
  });

  }


    return ( <Button onClick={handleSupply} disabled={!address || isConfirming || tokenAllowance < tokenBalance || tokenBalance === BigInt(0)} className="cursor-pointer">
    {isConfirming ? "Supplying..." :"Supply"}
  </Button>)
}
