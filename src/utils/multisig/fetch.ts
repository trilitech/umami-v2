import { TezosNetwork } from "@airgap/tezos";
import axios from "axios";
import { tzktUrls } from "../tezos/consts";
import {
  tzktGetBigMapKeysResponseType,
  tzktGetSameMultisigsResponseType,
} from "../tzkt/types";
import { multisigAddress } from "./consts";

const MULTISIG_FETCH_LIMIT = 10000;

export const getAllMultiSigContracts = async (
  network: TezosNetwork
): Promise<tzktGetSameMultisigsResponseType> => {
  try {
    const contractAddress = multisigAddress[network];
    const url = `${tzktUrls[network]}/v1/contracts/${contractAddress}/same?includeStorage=true&limit=${MULTISIG_FETCH_LIMIT}`;
    const { data } = await axios.get<tzktGetSameMultisigsResponseType>(url);

    return data.map(
      ({ address, balance, storage: { signers, threshold, pending_ops } }) => ({
        address,
        balance,
        storage: {
          signers,
          threshold,
          pending_ops,
        },
      })
    );
  } catch (error: any) {
    throw new Error(
      `Error fetching same contracts from tzkt: ${error.message}`
    );
  }
};

// get all pending operations for a multisig contract address
export const getPendingOperations = async (
  network: TezosNetwork,
  bigMap: number
): Promise<tzktGetBigMapKeysResponseType> => {
  const url = `${tzktUrls[network]}/v1/bigmaps/${bigMap}/keys`;
  const { data } = await axios.get<tzktGetBigMapKeysResponseType>(url);
  return data.map(({ active, key, value }) => ({
    active,
    key,
    value,
  }));
};
