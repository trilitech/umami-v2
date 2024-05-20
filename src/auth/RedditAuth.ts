import { Auth, IDP, JWT_AUTH_DOMAIN } from ".";

export class RedditAuth extends Auth {
  idpName: IDP = "reddit";
  clientId = "zyQ9tnKfdg3VNyj6MGhZq4dHbBzbmEvl";
  protected override async login() {
    const client = await this.getTorusClient();

    return client.triggerAggregateLogin({
      verifierIdentifier: "tezos-reddit",
      aggregateVerifierType: "single_id_verifier",
      subVerifierDetailsArray: [
        {
          verifier: "web-kukai",
          typeOfLogin: "jwt",
          clientId: this.clientId,
          jwtParams: {
            connection: "Reddit",
            verifierIdField: "name",
            domain: JWT_AUTH_DOMAIN,
          },
        },
      ],
    });
  }
}
