import { Button } from "@/components/ui/button";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect } from "react";
import { useTokenContext } from "../state/TokenProvider";
import { IPool_ABI } from "@bgd-labs/aave-address-book/abis";

export function SupplyWithPermit() {
const {address} = useAccount();
const { refreshData, tokenBalance, signature, setSignature } = useTokenContext();


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
    if(isConfirmed){
      setSignature(undefined);
    }
  },[isConfirmed])

const handleSupply = async () => {

  if(signature){
        await supply({
            address: AaveV3Sepolia.POOL,
            abi: IPool_ABI,
            functionName: "supplyWithPermit",
            args: [AaveV3Sepolia.ASSETS.AAVE.UNDERLYING, signature.amount, address || '0x0', 0, BigInt(signature?.deadline), Number(signature.v), signature.r as `0x${string}`, signature.s as `0x${string}`],
        });
    } else {
        console.error("Invalid Signature")
    }
  }


    return ( <Button onClick={handleSupply} disabled={!address || isConfirming || !signature || tokenBalance === BigInt(0)} className="cursor-pointer">
    {isConfirming ? "Supplying..." :"Supply"}
  </Button>)
}
