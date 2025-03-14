## Ethereum Token Approval Demo

<p align="center">
  <img src="https://i.ibb.co/r2mxKW1J/Approve-Demo.png" width="500" alt="approve demo screenshot">
</p>

Demo frontend to demonstrate Ethereum token approval methods:

- [Approve](#approve)
- [Permit](#permit)
- [Batched Approval](#batched-approval)

### Approve

ERC-20 token approval transaction: `IERC20(tokenAddress).approve(spender, allowance)`.

Requires execution of onchain transaction prior to transferring tokens.

### Permit

EIP-2612 signed token approval.

Requires wallet to sign message and signature is bundled with token transfer transaction.

### Batched Approval

EIP-5792 - wallet API to enable apps to request multiple batched action with `wallet_sendCalls`

|---- EIP-4337 - Smart contract wallet

|---- EIP-7702 - EOA wallet (private key)

The demo app sends EIP-5792 request to wallet and wallet must implement corresponding methods to perform batch transaction depending on wallet type.

## Demo Details

Demo app is a NextJS frontend using connectkit and wagmi for Web3 interactions. The app uses Sepolia testnet, and supplies tokens to Aave V3 as a demonstration of the token transfer step.
