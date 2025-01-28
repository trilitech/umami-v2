import { b58cencode, prefix } from "@taquito/utils";
import { type LoginParams } from "@web3auth/react-native-sdk";

import { web3auth } from "./AuthClient";

/**
 * Abstract class that's responsible for the social auth process
 * using Web3Auth SDK instead of Torus
 */
export abstract class Auth {
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
    try {
      console.log("login1 connected", web3auth.connected);
      if (!web3auth.connected) {
        await web3auth.init();
      }

      const loginParams = this.getLoginParams();
      await web3auth.login(loginParams);
      console.log("logged in")
    } catch (error) {
      console.error("Error logging in with Web3Auth:", error);
      throw error;
    }

    const userInfo = web3auth.userInfo();

    const privateKey = (await web3auth.provider?.request({
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

  async logout() {
    console.log("logout connected", web3auth.connected);

    if (!web3auth.connected) {
      await web3auth.init();
    }

    try {
      await web3auth.logout();
      console.log("logout")
    } catch (error) {
      console.error("Error logging out with Web3Auth:", error);
      throw error;
    }
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
