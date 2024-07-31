import type { Network, ResponseMessage, UserData } from "@trilitech-umami/umami-embed";
import { type SocialAccount } from "@umami/core";
import { GHOSTNET, MAINNET } from "@umami/tezos";

export const sendResponse = (response: ResponseMessage) =>
  window.parent.postMessage(JSON.stringify(response), "*");

export const sendLoginErrorResponse = (errorMessage: string) => {
  sendResponse({
    type: "login_response",
    error: "login_failed",
    errorMessage,
  });
};

export const sendOperationErrorResponse = (errorMessage: string) => {
  sendResponse({
    type: "operation_response",
    error: "operation_failed",
    errorMessage,
  });
};

export const toTezosNetwork = (network: Network) => {
  switch (network) {
    case "ghostnet":
      return GHOSTNET;
    case "mainnet":
      return MAINNET;
  }
};

export const toSocialAccount = (userData: UserData): SocialAccount => ({
  label: userData.id,
  type: "social",
  idp: userData.typeOfLogin,
  address: {
    type: "implicit",
    pkh: userData.pkh,
  },
  pk: userData.pk,
});
