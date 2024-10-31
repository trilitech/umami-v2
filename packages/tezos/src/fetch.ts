import { RpcClient } from "@taquito/rpc";

import { type Network } from "./types";

export const getProtocolSettings = (network: Network) =>
  new RpcClient(network.rpcUrl).getConstants();

export const isAccountRevealed = async (pkh: string, network: Network): Promise<boolean> => {
  const url = `${network.tzktApiUrl}/v1/accounts/${pkh}?select.fields=type,revealed`;
  const { type, revealed } = await fetch(url).then(res => res.json());
  return type !== "empty" && revealed;
};
