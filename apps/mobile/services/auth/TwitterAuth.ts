import { type LoginParams } from "@web3auth/react-native-sdk";

import { Auth } from "./Auth";

export class TwitterAuth extends Auth {
  getLoginParams(): LoginParams {
    return {
      loginProvider: "twitter",
    };
  }
}
