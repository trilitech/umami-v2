export enum TezosNetwork {
  MAINNET = "mainnet",
  GHOSTNET = "ghostnet",
}

export type Network = string;

export const DefaultNetworks = [TezosNetwork.GHOSTNET, TezosNetwork.MAINNET];
