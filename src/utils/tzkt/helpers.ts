import { Network } from "../../types/Network";

export const buildTzktAddressUrl = (network: Network, pkh: string) =>
  `${network.tzktExplorerUrl}/${pkh}`;
