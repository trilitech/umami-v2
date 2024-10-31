import { contractsGet, contractsGetCount } from "@tzkt/sdk-api";
import { type Network, type RawPkh } from "@umami/tezos";
import { withRateLimit } from "@umami/tzkt";
import range from "lodash/range";
import sortBy from "lodash/sortBy";

import { type RawTzktMultisigBigMap, type RawTzktMultisigContract } from "./types";

export const TYPE_HASH = 1963879877;
export const CODE_HASH = -1890025422;
const MULTISIG_QUERY = {
  kind: { eq: "smart_contract" as const },
  typeHash: { eq: TYPE_HASH },
  codeHash: { eq: CODE_HASH },
};
const LIMIT = 10000;

export const getAllMultisigContracts = async (network: Network) => {
  const count = await withRateLimit(() =>
    contractsGetCount(MULTISIG_QUERY as any, { baseUrl: network.tzktApiUrl })
  );

  const batches = await Promise.all(
    range(Math.ceil(count / LIMIT)).map(index =>
      withRateLimit(() =>
        contractsGet(
          {
            ...MULTISIG_QUERY,
            includeStorage: true,
            limit: LIMIT,
            offset: { pg: index },
            select: { fields: [["id", "address", "storage"].join(",")] },
          },
          {
            baseUrl: network.tzktApiUrl,
          }
        )
      )
    )
  );
  return sortBy(batches.flat(), "id") as RawTzktMultisigContract[];
};

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
        limit: Math.min(LIMIT, pkhs.length),
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
    return fetch(url).then(res => res.json());
  });
