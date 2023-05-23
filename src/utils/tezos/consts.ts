import { TezosNetwork } from "@airgap/tezos";
export const nodeUrls = {
  [TezosNetwork.GHOSTNET]: `https://tezos-ghostnet-node.prod.gke.papers.tech`,
  [TezosNetwork.MAINNET]: `https://mainnet.api.tez.ie`,
};

export const tzktUrls = {
  [TezosNetwork.GHOSTNET]: `https://api.ghostnet.tzkt.io`,
  [TezosNetwork.MAINNET]: `https://api.mainnet.tzkt.io`,
};

export const tzktExplorer = {
  [TezosNetwork.GHOSTNET]: `https://ghostnet.tzkt.io`,
  [TezosNetwork.MAINNET]: `https://tzkt.io`,
};

export const wertUrls = {
  [TezosNetwork.GHOSTNET]: `https://faucet.ghostnet.teztnets.xyz/`,
  [TezosNetwork.MAINNET]: `https://widget.wert.io`,
};

export const coincapUrl = "https://api.coincap.io/v2/assets";

export const bakersUrl = "https://api.baking-bad.org/v2/bakers";
