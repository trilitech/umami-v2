import { GHOSTNET, MAINNET } from "@umami/tezos";
import { CHAIN_NAMESPACES, type CustomChainConfig } from "@web3auth/base";

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

export const CHAIN_CONFIG_MAINNET: CustomChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1",
  rpcTarget: MAINNET.rpcUrl,
  displayName: "Tezos Mainnet",
  blockExplorerUrl: MAINNET.tzktExplorerUrl,
  ticker: "XTZ",
  tickerName: "Tezos",
};

export const CHAIN_CONFIG_GHOSTNET: CustomChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x5",
  rpcTarget: GHOSTNET.rpcUrl,
  displayName: "Tezos Ghostnet",
  blockExplorerUrl: GHOSTNET.tzktExplorerUrl,
  ticker: "XTZ",
  tickerName: "Tezos",
  isTestnet: true
};
