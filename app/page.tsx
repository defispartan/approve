"use client";

import { ConnectKitButton } from "connectkit";
import { Web3Provider } from "./state/Web3Provider";
import { TokenProvider } from "./state/TokenProvider";
import { Header } from "./view/Header";
import { Body } from "./view/Body";

export default function Page() {
  return (
    <Web3Provider>
      <TokenProvider>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
          <div className="flex flex-col items-center gap-2 mb-8">
            <h1 className="text-2xl font-bold">
              Approve Demo
            </h1>
            <div className="mt-5">
              <ConnectKitButton />
            </div>
            <div className="w-full max-w-6xl">
              <Header/>
              <Body/>
            </div>
          </div>
        </div>
      </TokenProvider>
    </Web3Provider>
  );
}