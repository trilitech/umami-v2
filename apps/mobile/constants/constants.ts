import { CHAIN_NAMESPACES } from "@web3auth/base";

export const STRINGS = {
  continueWith: "Continue with:",
  loginWith: "Login with Auth0",
  logout: "Logout",
  or: "or",
  createWallet: "Create a new wallet",
  alreadyHaveWallet: "I already have a wallet",
  byProceeding: "By proceeding, you agree to Umami's",
  terms: "Terms of Use",
  and: "and",
  privacyPolicy: "Privacy Policy",
};

export const WEB3_AUTH_CLIENT_ID = process.env.EXPO_PUBLIC_WEB3_AUTH_CLIENT_ID;

export const CHAIN_CONFIG_MAINNET = {
  chainNamespace: CHAIN_NAMESPACES.OTHER,
  chainId: "0x1",
  rpcTarget: "https://mainnet.tezos.ecadinfra.com",
  displayName: "Tezos Mainnet",
  blockExplorerUrl: "https://tzkt.io",
  ticker: "XTZ",
  tickerName: "Tezos",
};

export const CHAIN_CONFIG_GHOSTNET = {
  chainNamespace: CHAIN_NAMESPACES.OTHER,
  chainId: "0x5",
  rpcTarget: "https://ghostnet.tezos.ecadinfra.com",
  displayName: "Tezos Ghostnet",
  blockExplorerUrl: "https://ghostnet.tzkt.io",
  ticker: "XTZ",
  tickerName: "Tezos",
};
