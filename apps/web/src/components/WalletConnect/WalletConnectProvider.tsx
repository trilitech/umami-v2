import { createWeb3Wallet, subscribeToWeb3WalletEvents } from "@umami/state";
import { type PropsWithChildren, useEffect } from "react";

export const context = {};

export const WalletConnectProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {

    const initializeWallet = async () => {
      try {
        await createWeb3Wallet("wss://relay.walletconnect.com");
        subscribeToWeb3WalletEvents();
      } catch (error) {
        console.error("Error initializing Web3Wallet:", error);
      }
    };
    initializeWallet();
  }, []);

  return children;
};
