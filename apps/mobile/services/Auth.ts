import { b58cencode, prefix } from "@taquito/utils";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import Web3Auth, { type LoginParams, WEB3AUTH_NETWORK } from "@web3auth/react-native-sdk";
import { makeRedirectUri } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

import { CHAIN_CONFIG_GHOSTNET, WEB3_AUTH_CLIENT_ID } from "../constants";

/**
 * Abstract class that's responsible for the social auth process
 * using Web3Auth SDK instead of Torus
 */
export abstract class Auth {
  protected web3auth: Web3Auth;

  constructor() {
    this.web3auth = this.createWeb3AuthInstance();
  }

  protected createWeb3AuthInstance(): Web3Auth {
    const privateKeyProvider = new CommonPrivateKeyProvider({
      config: { chainConfig: CHAIN_CONFIG_GHOSTNET },
    });

    const redirectUrl = makeRedirectUri({
      scheme: "umami",
      path: "auth",
    });

    return new Web3Auth(WebBrowser, SecureStore, {
      clientId: WEB3_AUTH_CLIENT_ID!,
      network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      privateKeyProvider,
      redirectUrl,
    });
  }

  protected abstract getLoginParams(): LoginParams;

  async login(): Promise<{
    privateKey: string;
    userInfo: {
      email?: string;
      name?: string;
      profileImage?: string;
      verifierId?: string;
    };
  }> {
    if (!this.web3auth.ready) {
      await this.web3auth.init();
    }

    try {
      const loginParams = this.getLoginParams();
      console.log("loginParams", loginParams);
      await this.web3auth.login(loginParams);
    } catch (error) {
      console.error("Error logging in with Web3Auth:", error);
      throw error;
    }

    if (!this.web3auth.connected) {
      throw new Error("Web3Auth connection failed");
    }

    const userInfo = this.web3auth.userInfo();

    const privateKey = (await this.web3auth.provider?.request({
      method: "private_key",
    })) as string;

    return {
      privateKey,
      userInfo: {
        email: userInfo?.email,
        name: userInfo?.name,
        profileImage: userInfo?.profileImage,
        verifierId: userInfo?.verifierId || userInfo?.name,
      },
    };
  }

  async getCredentials(): Promise<{
    secretKey: string;
    id: string;
    name?: string;
    email?: string;
    imageUrl?: string;
  }> {
    const { privateKey, userInfo } = await this.login();

    const secretKey = b58cencode(privateKey, prefix.spsk);

    return {
      secretKey,
      id: userInfo.verifierId || userInfo.name || "",
      name: userInfo.name,
      email: userInfo.email,
      imageUrl: userInfo.profileImage,
    };
  }
}
