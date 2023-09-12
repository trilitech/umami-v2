import axios from "axios";
import { Network } from "../../types/Network";
import { RawTzktGetBigMapKeys, RawTzktGetSameMultisigs } from "../tzkt/types";
import { withRateLimit } from "../tezos";
const MULTISIG_FETCH_LIMIT = 10000;
const TYPE_HASH = 1963879877;
const CODE_HASH = -1890025422;

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

// get all pending operations for a multisig contract address
export const getPendingOperations = (
  bigMaps: number[],
  network: Network
): Promise<RawTzktGetBigMapKeys> =>
  withRateLimit(async () => {
    const url = `${network.tzktApiUrl}/v1/bigmaps/keys?active=true&bigmap.in=${bigMaps.join(
      ","
    )}&limit=${MULTISIG_FETCH_LIMIT}`;
    const { data } = await axios.get<RawTzktGetBigMapKeys>(url);
    return data;
  });
