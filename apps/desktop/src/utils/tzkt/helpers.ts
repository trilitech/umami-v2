import { type Network } from "../../types/Network";

export const buildTzktUrl = (network: Network, path: string) =>
  `${network.tzktExplorerUrl}/${path}`;
