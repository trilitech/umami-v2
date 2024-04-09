import { contractsGet } from "@tzkt/sdk-api";
import axios from "axios";

import { RawPkh } from "../../types/Address";
import { Network } from "../../types/Network";
import { RawTzktGetBigMapKeys, RawTzktGetSameMultisigs } from "../tzkt/types";

const MULTISIG_FETCH_LIMIT = 10000;

export const TYPE_HASH = 1963879877;
export const CODE_HASH = -1890025422;

export const getAllMultiSigContracts = async (
  network: Network
): Promise<RawTzktGetSameMultisigs> => {
  try {
    const url = `${network.tzktApiUrl}/v1/contracts?typeHash=${TYPE_HASH}&codeHash=${CODE_HASH}&includeStorage=true&limit=${MULTISIG_FETCH_LIMIT}`;
    const { data } = await axios.get<RawTzktGetSameMultisigs>(url);

    return data;
  } catch (error: any) {
    throw new Error(`Error fetching same contracts from tzkt: ${error.message}`);
  }
};

/**
 * Returns existing addresses for the given contract addresses list & the given network.
 *
 * @param network - network to fetch contracts from.
 * @param addresses - list of addresses to fetch contracts for.
 * @returns list of contract addresses that exist in the network.
 */
export const getExistingContracts = (pkhs: RawPkh[], network: Network): Promise<RawPkh[]> =>
  contractsGet(
    {
      address: { in: [pkhs.join(",")] },
      select: { fields: ["address"] },
    },
    {
      baseUrl: network.tzktApiUrl,
    }
  ) as any as Promise<RawPkh[]>;

// get all pending operations for a multisig contract address specified by the big map id
export const getPendingOperations = async (
  bigMaps: number[],
  network: Network
): Promise<RawTzktGetBigMapKeys> => {
  if (bigMaps.length === 0) {
    return Promise.resolve([]);
  }

  const url = `${network.tzktApiUrl}/v1/bigmaps/keys?active=true&bigmap.in=${bigMaps.join(
    ","
  )}&limit=${MULTISIG_FETCH_LIMIT}`;
  const { data } = await axios.get<RawTzktGetBigMapKeys>(url);
  return data;
};
