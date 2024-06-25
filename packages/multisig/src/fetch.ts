import { contractsGet } from "@tzkt/sdk-api";
import { type Network, type RawPkh } from "@umami/tezos";
import { withRateLimit } from "@umami/tzkt";
import axios from "axios";

import { type RawTzktMultisigBigMap, type RawTzktMultisigContract } from "./types";

export const TYPE_HASH = 1963879877;
export const CODE_HASH = -1890025422;

export const getAllMultisigContracts = async (network: Network) =>
  withRateLimit(() =>
    contractsGet(
      {
        typeHash: { eq: TYPE_HASH },
        codeHash: { eq: CODE_HASH },
        includeStorage: true,
        limit: 10000,
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  ) as Promise<RawTzktMultisigContract[]>;

/**
 * Returns existing addresses for the given contract addresses list & the given network.
 *
 * @param network - network to fetch contracts from.
 * @param addresses - list of addresses to fetch contracts for.
 * @returns list of contract addresses that exist in the network.
 */
export const getExistingContracts = (pkhs: RawPkh[], network: Network): Promise<RawPkh[]> =>
  withRateLimit(() =>
    contractsGet(
      {
        address: { in: [pkhs.join(",")] },
        select: { fields: ["address"] },
        limit: Math.min(10000, pkhs.length),
      },
      {
        baseUrl: network.tzktApiUrl,
      }
    )
  ) as any as Promise<RawPkh[]>;

// get all pending operations for a multisig contract address specified by the big map id
export const getPendingOperationsForMultisigs = async (
  bigMaps: number[],
  network: Network
): Promise<RawTzktMultisigBigMap[]> =>
  withRateLimit(async () => {
    if (bigMaps.length === 0) {
      return Promise.resolve([]);
    }

    const url = `${network.tzktApiUrl}/v1/bigmaps/keys?active=true&bigmap.in=${bigMaps.join(
      ","
    )}&limit=10000`;
    const { data } = await axios.get<RawTzktMultisigBigMap[]>(url);
    return data;
  });
