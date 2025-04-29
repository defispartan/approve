import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { IERC20_ABI } from "@bgd-labs/aave-address-book/abis";
import { EIP2612Abi } from "../utils/EIP2612Abi";

interface Signature {
  deadline: number;
  v?: bigint;
  r: string;
  s: string;
  amount: bigint;
}

interface TokenContextType {
  tokenBalance: bigint;
  aTokenBalance: bigint;
  tokenAllowance: bigint;
  signature: Signature | undefined;
  nonce: number;
  updateTokenBalance: () => Promise<void>;
  updateATokenBalance: () => Promise<void>;
  updateTokenAllowance: () => Promise<void>;
  updateNonce: () => Promise<void>;
  setSignature: (signature: Signature | undefined) => void;
  refreshData: () => Promise<void>;
}

const TokenContext = createContext<TokenContextType>({
  tokenBalance: BigInt(0),
  aTokenBalance: BigInt(0),
  tokenAllowance: BigInt(0),
  signature: undefined,
  nonce: 0,
  updateNonce: async () => {},
  updateTokenBalance: async () => {},
  updateATokenBalance: async () => {},
  updateTokenAllowance: async () => {},
  setSignature: () => {},
  refreshData: async () => {},
});

interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const { address } = useAccount();
  const [tokenBalance, setTokenBalance] = useState<bigint>(BigInt(0));
  const [aTokenBalance, setATokenBalance] = useState<bigint>(BigInt(0));
  const [tokenAllowance, setTokenAllowance] = useState<bigint>(BigInt(0));
  const [signature, setSignatureState] = useState<Signature | undefined>(undefined);
  const [nonce, setNonce] = useState<number>(0);

  const { data: aaveBalance, refetch: refetchAaveBalance } = useBalance({
    address,
    token: AaveV3Sepolia.ASSETS.AAVE.UNDERLYING,
  });

  const { data: aAaveBalance, refetch: refetchAAaveBalance } = useBalance({
    address,
    token: AaveV3Sepolia.ASSETS.AAVE.A_TOKEN,
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: AaveV3Sepolia.ASSETS.AAVE.UNDERLYING,
    abi: IERC20_ABI,
    functionName: "allowance",
    args: [address || "0x0", AaveV3Sepolia.POOL],
  });

  const { data: fetchedNonce, refetch: refetchNonce } = useReadContract({
    address: AaveV3Sepolia.ASSETS.AAVE.UNDERLYING,
    abi: EIP2612Abi,
    functionName: "nonces",
    args: [address || "0x0"],
  });

  useEffect(() => {
    if (aaveBalance && aaveBalance.value !== undefined) {
      setTokenBalance(aaveBalance.value);
    }
    if (aAaveBalance && aAaveBalance.value !== undefined) {
      setATokenBalance(aAaveBalance.value);
    }
    if (allowance !== undefined) {
      setTokenAllowance(allowance);
    }
    if (fetchedNonce !== undefined) {
      setNonce(Number(fetchedNonce));
    }
  }, [aaveBalance, aAaveBalance, allowance, fetchedNonce]);

  const updateTokenBalance = useCallback(async (): Promise<void> => {
    const result = await refetchAaveBalance();
    if (result.data && result.data.value !== undefined) {
      setTokenBalance(result.data.value);
    }
  }, [refetchAaveBalance]);

  const updateATokenBalance = useCallback(async (): Promise<void> => {
    const result = await refetchAAaveBalance();
    if (result.data && result.data.value !== undefined) {
      setATokenBalance(result.data.value);
    }
  }, [refetchAAaveBalance]);

  const updateTokenAllowance = useCallback(async (): Promise<void> => {
    const result = await refetchAllowance();
    if (result.data !== undefined) {
      setTokenAllowance(result.data);
    }
  }, [refetchAllowance]);

  const updateNonce = useCallback(async (): Promise<void> => {
    const result = await refetchNonce();
    if (result.data !== undefined) {
      setNonce(Number(result.data));
    }
  }, [refetchNonce]);

  const refreshData = useCallback(async (): Promise<void> => {
    await Promise.all([
      updateTokenBalance(),
      updateATokenBalance(),
      updateTokenAllowance(),
      updateNonce(),
    ]);
  }, [updateTokenBalance, updateATokenBalance, updateTokenAllowance, updateNonce]);

  const setSignature = useCallback((newSignature: Signature | undefined): void => {
    setSignatureState(newSignature);
  }, []);

  return (
    <TokenContext.Provider
      value={{
        tokenBalance,
        aTokenBalance,
        tokenAllowance,
        signature,
        nonce,
        updateTokenBalance,
        updateATokenBalance,
        updateTokenAllowance,
        updateNonce,
        setSignature,
        refreshData,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => useContext(TokenContext);
