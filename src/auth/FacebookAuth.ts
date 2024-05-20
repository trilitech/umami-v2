import { Auth } from "./Auth";
import type { IDP } from "./types";

export class FacebookAuth extends Auth {
  idpName: IDP = "facebook";
  clientId = "523634882377310";

  protected override async login() {
    const client = await this.getTorusClient();

    return client.triggerLogin({
      verifier: "tezos-facebook",
      clientId: this.clientId,
      typeOfLogin: "facebook",
      jwtParams: {
        scope: "public_profile email",
      },
    });
  }
}
