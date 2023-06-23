import { TezosNetwork } from "@airgap/tezos";
import { tzktExplorer } from "../tezos/consts";

export const buildTzktAddressUrl = (network: TezosNetwork, pkh: string) =>
  `${tzktExplorer[network]}/${pkh}`;
