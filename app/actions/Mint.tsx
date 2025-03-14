import { Button } from "@/components/ui/button";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { FaucetAbi } from "../utils/FaucetAbi";
import { zeroAddress } from "viem";
import { useEffect } from "react";
import { useTokenContext } from "../state/TokenProvider";

export function Mint() {
const {address} = useAccount();
const { updateTokenBalance } = useTokenContext();


const {
  writeContract: mintUSDC,
  data: hash
} = useWriteContract();

const { isLoading: isConfirming, isSuccess: isConfirmed } =
  useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    updateTokenBalance();
  },[isConfirmed, updateTokenBalance])

const handleMint = async () => {
  await mintUSDC({
      address: AaveV3Sepolia.FAUCET,
      abi: FaucetAbi,
      functionName: 'mint',
      args: [AaveV3Sepolia.ASSETS.USDC.UNDERLYING, address || zeroAddress, BigInt(10000000000)]
    });
  }


    return ( <Button onClick={handleMint} disabled={!address || isConfirming} className="w-full cursor-pointer mt-5">
    {isConfirming ? "Minting..." :"Mint"}
  </Button>)
}