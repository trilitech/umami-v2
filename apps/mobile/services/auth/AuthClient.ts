import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import Web3Auth, { WEB3AUTH_NETWORK } from "@web3auth/react-native-sdk";
import { makeRedirectUri } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

import { CHAIN_CONFIG_MAINNET, WEB3_AUTH_CLIENT_ID } from "../../constants";

class AuthClient extends Web3Auth {
  constructor() {
    const privateKeyProvider = new CommonPrivateKeyProvider({
      config: { chainConfig: CHAIN_CONFIG_MAINNET },
    });

    const redirectUrl = makeRedirectUri({
      scheme: "umami",
      path: "auth",
    });

    super(WebBrowser, SecureStore, {
      clientId: WEB3_AUTH_CLIENT_ID!,
      network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      privateKeyProvider,
      redirectUrl,
    });
  }
}

export const web3auth = new AuthClient();
