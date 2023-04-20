import { TezosNetwork } from "@airgap/tezos";
export const nodeUrls = {
  [TezosNetwork.GHOSTNET]: `https://ghostnet.ecadinfra.com`,
  [TezosNetwork.MAINNET]: `https://mainnet.api.tez.ie`,
};

export const tzktUrls = {
  [TezosNetwork.GHOSTNET]: `https://api.ghostnet.tzkt.io`,
  [TezosNetwork.MAINNET]: `https://api.mainnet.tzkt.io`,
};

export const coincapUrl = "https://api.coincap.io/v2/assets";
