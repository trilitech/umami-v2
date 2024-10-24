import { RpcClient } from "@taquito/rpc";
// import axios from "axios";
const axios = {} as any;

import { type Network } from "./types";

export const getProtocolSettings = (network: Network) =>
  new RpcClient(network.rpcUrl).getConstants();

export const isAccountRevealed = async (pkh: string, network: Network): Promise<boolean> => {
  const url = `${network.tzktApiUrl}/v1/accounts/${pkh}?select.fields=type,revealed`;
  const {
    data: { type, revealed },
  } = await axios.get(url);
  return type !== "empty" && revealed;
};
