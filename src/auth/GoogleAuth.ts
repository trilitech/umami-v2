import { Auth } from "./Auth";
import type { IDP } from "./types";

export class GoogleAuth extends Auth {
  idpName: IDP = "google";
  clientId = "1070572364808-d31nlkneam5ee6dr0tu28fjjbsdkfta5.apps.googleusercontent.com";

  protected override async login() {
    const client = await this.getTorusClient();

    return client.triggerAggregateLogin({
      verifierIdentifier: "tezos-google",
      aggregateVerifierType: "single_id_verifier",
      subVerifierDetailsArray: [
        {
          clientId: this.clientId,
          typeOfLogin: "google",
          verifier: "umami",
        },
      ],
    });
  }
}
