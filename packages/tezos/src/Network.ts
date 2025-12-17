import { type Network } from "./types";

export const MAINNET: Network = {
  name: "mainnet",
  rpcUrl: "https://mainnet.tezos.ecadinfra.com",
  tzktApiUrl: "https://api.mainnet.tzkt.io",
  tzktExplorerUrl: "https://tzkt.io",
  buyTezUrl: "https://widget.wert.io",
};

export const GHOSTNET: Network = {
  name: "ghostnet",
  rpcUrl: "https://ghostnet.tezos.ecadinfra.com",
  tzktApiUrl: "https://api.ghostnet.tzkt.io",
  tzktExplorerUrl: "https://ghostnet.tzkt.io",
  buyTezUrl: "https://faucet.ghostnet.teztnets.com/",
};

export const SHADOWNET: Network = {
  name: "shadownet",
  rpcUrl: "https://shadownet.tezos.ecadinfra.com",
  tzktApiUrl: "https://api.shadownet.tzkt.io",
  tzktExplorerUrl: "https://shadownet.tzkt.io",
  buyTezUrl: "https://faucet.shadownet.teztnets.com/",
};

export const isDefault = (network: Network) => !!DefaultNetworks.find(n => n.name === network.name);

export const DefaultNetworks: Network[] = [MAINNET, GHOSTNET, SHADOWNET];
