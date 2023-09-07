export const MAINNET: Network = {
  name: "mainnet",
  rpcUrl: "https://prod.tcinfra.net/rpc/mainnet/",
  tzktApiUrl: "https://api.mainnet.tzkt.io",
  tzktExplorerUrl: "https://tzkt.io",
  buyTezUrl: "https://widget.wert.io",
};

export const GHOSTNET: Network = {
  name: "ghostnet",
  rpcUrl: "https://ghostnet.ecadinfra.com",
  tzktApiUrl: "https://api.ghostnet.tzkt.io",
  tzktExplorerUrl: "https://ghostnet.tzkt.io",
  buyTezUrl: "https://faucet.ghostnet.teztnets.xyz/",
};

export type NetworkName = string; // must be unique

export type Network = {
  name: NetworkName;
  rpcUrl: string;
  tzktApiUrl: string;
  tzktExplorerUrl?: string;
  buyTezUrl?: string;
};

export const DefaultNetworks: Network[] = [MAINNET, GHOSTNET];
