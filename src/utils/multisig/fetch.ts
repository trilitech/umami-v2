import { TezosNetwork } from "@airgap/tezos";
import axios from "axios";
import { tzktUrls } from "../tezos/consts";
import { RawTzktGetBigMapKeys, RawTzktGetSameMultisigs } from "../tzkt/types";
import { multisigAddress } from "./consts";

const MULTISIG_FETCH_LIMIT = 10000;

export const getAllMultiSigContracts = async (
  network: TezosNetwork
): Promise<RawTzktGetSameMultisigs> => {
  try {
    const contractAddress = multisigAddress[network];
    const url = `${tzktUrls[network]}/v1/contracts/${contractAddress}/same?includeStorage=true&limit=${MULTISIG_FETCH_LIMIT}`;
    const { data } = await axios.get<RawTzktGetSameMultisigs>(url);

    return data.map(({ address, storage: { signers, threshold, pending_ops } }) => ({
      address,
      storage: {
        signers,
        threshold,
        pending_ops,
      },
    }));
  } catch (error: any) {
    throw new Error(`Error fetching same contracts from tzkt: ${error.message}`);
  }
};

// get all pending operations for a multisig contract address
export const getPendingOperations = async (
  bigMaps: number[],
  network: TezosNetwork
): Promise<RawTzktGetBigMapKeys> => {
  const url = `${tzktUrls[network]}/v1/bigmaps/keys?active=true&bigmap.in=${bigMaps.join(",")}`;
  const { data } = await axios.get<RawTzktGetBigMapKeys>(url);
  return data.map(({ bigmap, active, key, value }) => ({
    bigmap,
    active,
    key,
    value,
  }));
};
