import {Core} from "@walletconnect/core";
import {type IWeb3Wallet, Web3Wallet } from "@walletconnect/web3wallet";

export let web3wallet: IWeb3Wallet;

export async function createWeb3Wallet(relayerRegionURL: string) {
  const core = new Core({
    projectId: "252533b433e70f85a0e5c8b53b97faea",
    relayUrl: relayerRegionURL,
    logger: "trace",
  });
  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: "Umami Wallet",
      description: "Umami Wallet with WalletConnect",
      url: "www.walletconnect.com",
      icons: ["https://umamiwallet.com/assets/favicon-32-45gq0g6M.png"],
    },
  });

  try {
    const clientId = await web3wallet.engine.signClient.core.crypto.getClientId();
    console.log("WalletConnect ClientID: ", clientId);
    localStorage.setItem("WALLETCONNECT_CLIENT_ID", clientId);
  } catch (error) {
    console.error("Failed to set WalletConnect clientId in localStorage: ", error);
  }
}
