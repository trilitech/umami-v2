import { RpcClient } from "@taquito/rpc";

import { type Network } from "./Network";

export const getProtocolSettings = (network: Network) =>
  new RpcClient(network.rpcUrl).getConstants();
