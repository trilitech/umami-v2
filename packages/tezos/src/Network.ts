import { type Network } from "./types";

export const MAINNET: Network = {
  name: "mainnet",
  // the previous default (mainnet.tezos.ecadinfra.com) was shut down along with ghostnet
  rpcUrl: "https://rpc.tzbeta.net",
  tzktApiUrl: "https://api.mainnet.tzkt.io",
  tzktExplorerUrl: "https://tzkt.io",
  buyTezUrl: "https://widget.wert.io",
};

export const SHADOWNET: Network = {
  name: "shadownet",
  rpcUrl: "https://rpc.shadownet.teztnets.com",
  tzktApiUrl: "https://api.shadownet.tzkt.io",
  tzktExplorerUrl: "https://shadownet.tzkt.io",
  buyTezUrl: "https://faucet.shadownet.teztnets.com/",
};

/**
 * Ghostnet was sunset in May 2026 — use {@link SHADOWNET} instead.
 * Kept only as a test fixture and for the persisted-state migration;
 * not part of {@link DefaultNetworks} anymore.
 */
export const GHOSTNET: Network = {
  name: "ghostnet",
  rpcUrl: "https://ghostnet.tezos.ecadinfra.com",
  tzktApiUrl: "https://api.ghostnet.tzkt.io",
  tzktExplorerUrl: "https://ghostnet.tzkt.io",
  buyTezUrl: "https://faucet.ghostnet.teztnets.com/",
};

export const isDefault = (network: Network) => !!DefaultNetworks.find(n => n.name === network.name);

export const DefaultNetworks: Network[] = [MAINNET, SHADOWNET];
