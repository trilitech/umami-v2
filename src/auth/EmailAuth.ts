import { Auth } from "./Auth";
import { JWT_AUTH_DOMAIN } from "./constants";
import type { IDP } from "./types";

export class EmailAuth extends Auth {
  clientId = "LTg6fVsacafGmhv14TZlrWF1EavwQoDZ";
  idpName: IDP = "email";

  protected override async login() {
    const client = await this.getTorusClient();

    return client.triggerAggregateLogin({
      verifierIdentifier: "tezos-google",
      aggregateVerifierType: "single_id_verifier",
      subVerifierDetailsArray: [
        {
          verifier: "web-kukai-email",
          typeOfLogin: "jwt",
          clientId: this.clientId,
          jwtParams: {
            connection: "",
            verifierIdField: "name",
            domain: JWT_AUTH_DOMAIN,
          },
        },
      ],
    });
  }
}
