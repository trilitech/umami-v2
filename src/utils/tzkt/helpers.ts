import { TezosNetwork } from "../../types/TezosNetwork";
import { tzktExplorer } from "../tezos/consts";

export const buildTzktAddressUrl = (network: TezosNetwork, pkh: string) =>
  `${tzktExplorer[network]}/${pkh}`;
