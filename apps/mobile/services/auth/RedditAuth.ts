import { type LoginParams } from "@web3auth/react-native-sdk";

import { Auth } from "./Auth";

export class RedditAuth extends Auth {
  getLoginParams(): LoginParams {
    return {
      loginProvider: "reddit",
    };
  }
}
