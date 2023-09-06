import { Network } from "../../types/Network";

export const nodeUrls: Record<Network, string> = {
  ghostnet: `https://tezos-ghostnet-node.prod.gke.papers.tech`,
  mainnet: `https://mainnet.api.tez.ie`,
};

export const tzktUrls: Record<Network, string> = {
  ghostnet: `https://api.ghostnet.tzkt.io`,
  mainnet: `https://api.mainnet.tzkt.io`,
};

export const tzktExplorer: Record<Network, string> = {
  ghostnet: `https://ghostnet.tzkt.io`,
  mainnet: `https://tzkt.io`,
};

export const wertUrls: Record<Network, string> = {
  ghostnet: `https://faucet.ghostnet.teztnets.xyz/`,
  mainnet: `https://widget.wert.io`,
};

export const coincapUrl = "https://api.coincap.io/v2/assets";

export const TEZ = "ꜩ";

export const TEZ_DECIMALS = 6;
