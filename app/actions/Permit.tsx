import { Button } from "@/components/ui/button";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import {
  useAccount,
  useSignTypedData,
} from "wagmi";
import { useTokenContext } from "../state/TokenProvider";
import { useEffect } from "react";
import { parseSignature } from "viem";

export function Permit() {
  const { address } = useAccount();
  const { setSignature, signature, nonce, tokenBalance } = useTokenContext();

  const { data: signedData, isPending, signTypedData } = useSignTypedData();
  const deadline = 5686505641;

  useEffect(() => {
    if(signedData){
        const {v,r,s} = parseSignature(signedData);
        setSignature({deadline, v, r, s, amount: tokenBalance})
    }
  },[signedData, deadline])

  const handlePermit = async () => {
    if (!address) return;

    const domain = {
      name: "USDC",
      version: "1",
      chainId: 11155111,
      verifyingContract: AaveV3Sepolia.ASSETS.USDC.UNDERLYING,
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const message = {
      owner: address as `0x${string}`,
      spender: AaveV3Sepolia.POOL as `0x${string}`,
      value: tokenBalance,
      nonce: BigInt(nonce),
      deadline: BigInt(deadline),
    };

    try {
      await signTypedData({
        domain,
        types,
        message,
        primaryType: "Permit"
      });
    } catch (error) {
      console.error("Error signing permit:", error);
    }
  };

  return (
    <Button
      onClick={handlePermit}
      disabled={!address || !!signature || tokenBalance === BigInt(0)}
      className="cursor-pointer"
    >
      {isPending ? "Signing..." : "Sign"}
    </Button>
  );
}
