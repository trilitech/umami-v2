import { type LoginParams } from "@web3auth/react-native-sdk";

import { Auth } from "./Auth";

export class FacebookAuth extends Auth {
  getLoginParams(): LoginParams {
    return {
      loginProvider: "facebook",
    };
  }
}
