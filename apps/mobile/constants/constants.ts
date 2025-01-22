import { ChainNamespace } from "@web3auth/react-native-sdk";

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

export const CHAIN_CONFIG = {
  chainNamespace: ChainNamespace.EIP155,
  chainId: "0x1",
  rpcTarget: "https://rpc.tzbeta.net/",
  displayName: "Tezos Mainnet",
  blockExplorerUrl: "https://tzstats.com",
  ticker: "XTZ",
  tickerName: "Tezos",
};
