import { TezosNetwork } from "../../types/Network";
import { tzktExplorer } from "../tezos/consts";

export const buildTzktAddressUrl = (network: TezosNetwork, pkh: string) =>
  `${tzktExplorer[network]}/${pkh}`;
