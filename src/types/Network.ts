export const MAINNET: TezosNetwork = "mainnet";
export const GHOSTNET: TezosNetwork = "ghostnet";

export type TezosNetwork = "mainnet" | "ghostnet";

export type Network = string;

export const DefaultNetworks: TezosNetwork[] = [MAINNET, GHOSTNET];
