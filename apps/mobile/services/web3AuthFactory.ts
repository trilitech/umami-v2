import Web3Auth, { WEB3AUTH_NETWORK } from "@web3auth/react-native-sdk";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { CHAIN_CONFIG, WEB3_AUTH_CLIENT_ID } from "../constants";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { makeRedirectUri } from "expo-auth-session";

export const createWeb3AuthInstance = () => {
  const privateKeyProvider = new CommonPrivateKeyProvider({
    config: { chainConfig: CHAIN_CONFIG },
  });

  const redirectUrl = makeRedirectUri({
    scheme: "umami",
    path: "auth",
  });

  console.log("redirectUrl", redirectUrl);

  return new Web3Auth(WebBrowser, SecureStore, {
    clientId: WEB3_AUTH_CLIENT_ID ?? "",
    network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
    redirectUrl,
  });
};
