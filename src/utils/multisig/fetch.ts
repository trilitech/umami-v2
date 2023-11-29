import axios from "axios";

import { Network } from "../../types/Network";
import { withRateLimit } from "../tezos";
import { RawTzktGetBigMapKeys, RawTzktGetSameMultisigs } from "../tzkt/types";
const MULTISIG_FETCH_LIMIT = 10000;
export const TYPE_HASH = 1963879877;
export const CODE_HASH = -1890025422;

export const getAllMultiSigContracts = (network: Network): Promise<RawTzktGetSameMultisigs> =>
  withRateLimit(async () => {
    try {
      const url = `${network.tzktApiUrl}/v1/contracts?typeHash=${TYPE_HASH}&codeHash=${CODE_HASH}&includeStorage=true&limit=${MULTISIG_FETCH_LIMIT}`;
      const { data } = await axios.get<RawTzktGetSameMultisigs>(url);

      return data;
    } catch (error: any) {
      throw new Error(`Error fetching same contracts from tzkt: ${error.message}`);
    }
  });

// get all pending operations for a multisig contract address specified by the big map id
export const getPendingOperations = (
  bigMaps: number[],
  network: Network
): Promise<RawTzktGetBigMapKeys> => {
  if (bigMaps.length === 0) {
    return Promise.resolve([]);
  }

  return withRateLimit(async () => {
    const url = `${network.tzktApiUrl}/v1/bigmaps/keys?active=true&bigmap.in=${bigMaps.join(
      ","
    )}&limit=${MULTISIG_FETCH_LIMIT}`;
    const { data } = await axios.get<RawTzktGetBigMapKeys>(url);
    return data;
  });
};
