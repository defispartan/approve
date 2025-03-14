import { Card, CardContent } from "@/components/ui/card"
import { formatUnits } from "viem"
import { useTokenContext } from "../state/TokenProvider"
import { Mint } from "../actions/Mint"
import { Revoke } from "../actions/Revoke"
import { Refresh } from "../actions/Refresh"
import { ClearSignature } from "../actions/ClearSignature"

export function Header() {
  const { tokenBalance, aTokenBalance, tokenAllowance } = useTokenContext();

  const formatBalance = (balance: bigint ) => {
    if (!balance) return "0.00"
    return formatUnits(balance, 6);
  }

  const suffixes: string[] = [
    "", "k", "m", "b", "t"
  ];
  
  function truncateBigInt(value: string): string {
    if (Number(value) < 100000) return value;
    if (Number(value) > 100000000000) return ">100 billion"
    const len = value.length;
    const suffixIndex = Math.floor((len - 1) / 3);
    const divisor = 10 ** suffixIndex * 3;
    const truncated = Number(value) / divisor;
    const suffix = suffixes[suffixIndex] || "";
    return truncated.toString() + suffix;
  }

  return (
    <Card className="w-full mt-5">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Balances</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>USDC Balance:</span>
            <span className="font-medium">{formatBalance(tokenBalance)}</span>
          </div>
          <div className="flex justify-between">
            <span>aUSDC Balance:</span>
            <span className="font-medium">{formatBalance(aTokenBalance)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pool Approved Amount:</span>
            <span className="font-medium">{truncateBigInt(formatBalance(tokenAllowance))}</span>
          </div>
        </div>

        <Mint />
        <Revoke />
        <Refresh />
        <ClearSignature />
      </CardContent>
    </Card>
  )
}
