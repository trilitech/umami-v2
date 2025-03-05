import { type IWalletKit, WalletKit } from "@reown/walletkit";
import { Core } from "@walletconnect/core";

export let walletKit: IWalletKit;

export const createWalletKit = async () => {
  const core = new Core({
    projectId: "27cab1157f006c2d45f5c10fc2c7c4d4",
  });

  walletKit = await WalletKit.init({
    core,
    metadata: {
      name: "Umami Wallet",
      description: "Umami Wallet with WalletConnect",
      url: "https://umamiwallet.com",
      icons: ["https://umamiwallet.com/assets/favicon-32-45gq0g6M.png"],
    },
  });

  try {
    const clientId = await walletKit.engine.signClient.core.crypto.getClientId();
    console.log("WalletConnect ClientID: ", clientId);
  } catch (error) {
    console.error("Failed to set WalletConnect clientId in localStorage: ", error);
  }
};
