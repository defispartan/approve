import { Button } from "@/components/ui/button";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect } from "react";
import { useTokenContext } from "../state/TokenProvider";
import { IPool_ABI } from "@bgd-labs/aave-address-book/abis";
import { useSendCalls } from 'wagmi/experimental'
import { wagmiConfig } from "../state/Web3Provider";
import { parseEther } from "viem";

export function BatchSupply() {
const {address} = useAccount();
const { refreshData, tokenAllowance, tokenBalance } = useTokenContext();
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
    sendCalls({
        calls: [ {
            to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
            value: parseEther('0.0000000001')
          },
          {
            data: '0xdeadbeef',
            to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
          },]
    })
  /* await supply({
    address: AaveV3Sepolia.POOL,
    abi: IPool_ABI,
    functionName: "supply",
    args: [AaveV3Sepolia.ASSETS.USDC.UNDERLYING, tokenBalance, address || '0x0', 0],
  }); */

  }


    return ( <Button onClick={handleSupply} disabled={!address || isPending || tokenBalance === BigInt(0)} className="cursor-pointer">
    {isPending ? "Supplying..." :"Supply"}
  </Button>)
}
