import {
  type Network,
  type ResponseMessage,
  type UserData,
} from "@trilitech-umami/umami-embed/types";
import { type SocialAccount } from "@umami/core";
import { GHOSTNET, MAINNET, TEZ, TEZ_DECIMALS } from "@umami/tezos";

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

// TODO: reuse from @umami/tezos once moved
import { format } from "@taquito/utils";
import BigNumber from "bignumber.js";

export const truncate = (name: string, len: number) =>
  name.length > len ? name.slice(0, len - 3) + "..." : name;

export const tezToMutez = (tez: string): BigNumber => format("tz", "mutez", tez) as BigNumber;

export const mutezToTez = (mutez: BigNumber | string | number) =>
  format("mutez", "tz", mutez) as BigNumber;

const formatTezAmount = (mutez: BigNumber | string | number): string => {
  const tezAmount = BigNumber(mutezToTez(mutez)).toNumber();
  // make sure we always show 6 digits after the decimal point
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: TEZ_DECIMALS,
    maximumFractionDigits: TEZ_DECIMALS,
  });

  return formatter.format(tezAmount);
};

export const prettyTezAmount = (mutez: BigNumber | string | number): string => {
  const fee = formatTezAmount(mutez);
  return `${fee} ${TEZ}`;
};

// Generates displayed account address string from public key hash
export const formatPkh = (pkh: string) => `${pkh.slice(0, 5)}...${pkh.slice(-5)}`;
