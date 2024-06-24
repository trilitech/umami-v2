import { b58cencode, prefix } from "@taquito/utils";
import CustomAuth, {
  type TorusAggregateLoginResponse,
  type TorusLoginResponse,
} from "@toruslabs/customauth";

import { type IDP, type RedirectSurface } from "./types";

const WEB3_AUTH_CLIENT_ID =
  "BBQoFIabI50S1-0QsGHGTM4qID_FDjja0ZxIxKPyFqc0El--M-EG0c2giaBYVTVVE6RC9WCUzCJyW24aJrR_Lzc";

/**
 * Abstract class that's responsible for the social auth process
 *
 * the details are defined in the subclasses.
 */
export abstract class Auth {
  abstract idpName: IDP;
  abstract clientId: string;
  redirectSurface: RedirectSurface;

  constructor(redirectSurface: RedirectSurface) {
    this.redirectSurface = redirectSurface;
  }

  /* istanbul ignore next */
  protected async getTorusClient(): Promise<CustomAuth> {
    const torus = new CustomAuth({
      web3AuthClientId: WEB3_AUTH_CLIENT_ID,
      baseUrl: "https://umamiwallet.com/auth/v2.2.0/",
      redirectPathName: "redirect.html",
      redirectToOpener: this.redirectSurface as any as boolean,
      uxMode: "popup",
      network: "mainnet",
    });

    await torus.init({ skipSw: true });

    return torus;
  }

  abstract login(): Promise<TorusAggregateLoginResponse | TorusLoginResponse>;

  async getCredentials(): Promise<{
    secretKey: string;
    name: string;
  }> {
    const loginResult = await this.login();
    const privateKey = loginResult.finalKeyData.privKey || loginResult.oAuthKeyData.privKey;
    const secretKey = b58cencode(privateKey, prefix.spsk);

    const userInfo = Array.isArray(loginResult.userInfo)
      ? loginResult.userInfo[0]
      : loginResult.userInfo;

    const accountName = userInfo.email || userInfo.name || this.idpName;

    return { secretKey, name: accountName };
  }
}
