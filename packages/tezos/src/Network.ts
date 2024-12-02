import { type Network } from "./types";

export const MAINNET: Network = {
  name: "mainnet",
  rpcUrl: "https://mainnet.ecadinfra.com",
  tzktApiUrl: "https://api.mainnet.tzkt.io",
  tzktExplorerUrl: "https://tzkt.io",
  buyTezUrl: "https://widget.wert.io",
};

export const GHOSTNET: Network = {
  name: "ghostnet",
  rpcUrl: "https://ghostnet.ecadinfra.com",
  tzktApiUrl: "https://api.ghostnet.tzkt.io",
  tzktExplorerUrl: "https://ghostnet.tzkt.io",
  buyTezUrl: "https://faucet.ghostnet.teztnets.com/",
};

export const isDefault = (network: Network) => !!DefaultNetworks.find(n => n.name === network.name);

export const DefaultNetworks: Network[] = [MAINNET, GHOSTNET];
