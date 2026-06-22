import { type Network } from "./types";

export const MAINNET: Network = {
  name: "mainnet",
  rpcUrl: "https://tezos-mainnet.octez.io",
  tzktApiUrl: "https://api.tzkt.io",
  tzktExplorerUrl: "https://tzkt.io",
  buyTezUrl: "https://widget.wert.io",
};

export const SHADOWNET: Network = {
  name: "shadownet",
  rpcUrl: "https://tezos-shadownet.octez.io",
  tzktApiUrl: "https://api.shadownet.tzkt.io",
  tzktExplorerUrl: "https://shadownet.tzkt.io",
  buyTezUrl: "https://faucet.shadownet.teztnets.com/",
};

/** @deprecated Use SHADOWNET instead */
export const GHOSTNET: Network = SHADOWNET;

export const isDefault = (network: Network) => !!DefaultNetworks.find(n => n.name === network.name);

export const DefaultNetworks: Network[] = [MAINNET, GHOSTNET, SHADOWNET];
