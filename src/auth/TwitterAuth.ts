import { Auth } from "./Auth";
import { JWT_AUTH_DOMAIN } from "./constants";
import type { IDP } from "./types";

export class TwitterAuth extends Auth {
  idpName: IDP = "twitter";
  clientId = "3aCoxh3pw8g8JeFsdlJNUGwdgtLwdwgE";

  protected override async login() {
    const client = await this.getTorusClient();

    return client.triggerLogin({
      verifier: "tezos-twitter",
      clientId: this.clientId,
      typeOfLogin: "twitter",
      jwtParams: {
        domain: JWT_AUTH_DOMAIN,
      },
    });
  }
}
