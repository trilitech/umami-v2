import { Network } from "../../types/Network";
import { tzktExplorer } from "../tezos/consts";

export const buildTzktAddressUrl = (network: Network, pkh: string) =>
  `${tzktExplorer[network]}/${pkh}`;
