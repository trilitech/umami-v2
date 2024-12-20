import * as api from "@tzkt/sdk-api";
import { DefaultNetworks, GHOSTNET, mockImplicitAddress } from "@umami/tezos";
import range from "lodash/range";

import {
  CODE_HASH,
  TYPE_HASH,
  getAllMultisigContracts,
  getExistingContracts,
  getPendingOperationsForMultisigs,
} from "./fetch";

const mockedContractsGet = jest.spyOn(api, "contractsGet");
const mockedContractsGetCount = jest.spyOn(api, "contractsGetCount");

const multisigContracts = [
  {
    id: 536908,
    type: "contract",
    address: "KT1VwWbTMRN5uX4bfxCcpJnPP6iAhboqhGZr",
    kind: "smart_contract",
    balance: 0,
    creator: { address: "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E" },
    numContracts: 0,
    activeTokensCount: 0,
    tokensCount: 0,
    tokenBalancesCount: 0,
    tokenTransfersCount: 0,
    numDelegations: 0,
    numOriginations: 1,
    numTransactions: 0,
    numReveals: 0,
    numMigrations: 0,
    transferTicketCount: 0,
    increasePaidStorageCount: 0,
    eventsCount: 0,
    firstActivity: 1667087,
    firstActivityTime: "2022-12-15T16:49:45Z",
    lastActivity: 1667087,
    lastActivityTime: "2022-12-15T16:49:45Z",
    storage: {
      owner: "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E",
      signers: [
        "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
        "tz1VTfGqp34NypRQJmjNiPrCTG5TRonevsmf",
        "tz1g2pCYFonfHXqjNCJNnGRy6MamDPdon4oS",
      ],
      metadata: 219459,
      threshold: "2",
      last_op_id: "0",
      pending_ops: 219458,
    },
    typeHash: 1963879877,
    codeHash: -1890025422,
  },
  {
    id: 537023,
    type: "contract",
    address: "KT1Vdhz4izz7LASWU4tTLu3GBsvhJ8ULSi3G",
    kind: "smart_contract",
    balance: 0,
    creator: { address: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3" },
    numContracts: 0,
    activeTokensCount: 0,
    tokensCount: 0,
    tokenBalancesCount: 0,
    tokenTransfersCount: 0,
    numDelegations: 0,
    numOriginations: 1,
    numTransactions: 0,
    numReveals: 0,
    numMigrations: 0,
    transferTicketCount: 0,
    increasePaidStorageCount: 0,
    eventsCount: 0,
    firstActivity: 1668011,
    firstActivityTime: "2022-12-15T21:21:20Z",
    lastActivity: 1668011,
    lastActivityTime: "2022-12-15T21:21:20Z",
    storage: {
      owner: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
      signers: ["tz1RVPjF88wjiZ7JhxvmLPRm6TTR9MHPAFPd", "tz1ajzeMEzKxM9H4keBxoD1JSQy3iGRoHPg5"],
      metadata: 219536,
      threshold: "1",
      last_op_id: "0",
      pending_ops: 219535,
    },
    typeHash: 1963879877,
    codeHash: -1890025422,
  },
  {
    id: 533705,
    type: "contract",
    address: "KT1Mqvf7bnYe4Ty2n7ZbGkdbebCd4WoTJUUp",
    kind: "smart_contract",
    balance: 0,
    creator: { address: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3" },
    numContracts: 0,
    activeTokensCount: 0,
    tokensCount: 0,
    tokenBalancesCount: 0,
    tokenTransfersCount: 0,
    numDelegations: 0,
    numOriginations: 1,
    numTransactions: 0,
    numReveals: 0,
    numMigrations: 0,
    transferTicketCount: 0,
    increasePaidStorageCount: 0,
    eventsCount: 0,
    firstActivity: 1636117,
    firstActivityTime: "2022-12-09T16:49:25Z",
    lastActivity: 1636117,
    lastActivityTime: "2022-12-09T16:49:25Z",
    storage: {
      owner: "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
      signers: ["tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3", "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E"],
      metadata: 216412,
      threshold: "1",
      last_op_id: "0",
      pending_ops: 216411,
    },
    typeHash: 1963879877,
    codeHash: -1890025422,
  },
];

describe("multisig fetch", () => {
  const expectedMockedMultisigContracts = [
    {
      id: 533705,
      address: "KT1Mqvf7bnYe4Ty2n7ZbGkdbebCd4WoTJUUp",
      storage: {
        pending_ops: 216411,
        signers: ["tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3", "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E"],
        threshold: "1",
      },
    },
    {
      id: 536908,
      address: "KT1VwWbTMRN5uX4bfxCcpJnPP6iAhboqhGZr",
      storage: {
        pending_ops: 219458,
        signers: [
          "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
          "tz1VTfGqp34NypRQJmjNiPrCTG5TRonevsmf",
          "tz1g2pCYFonfHXqjNCJNnGRy6MamDPdon4oS",
        ],
        threshold: "2",
      },
    },
    {
      id: 537023,
      address: "KT1Vdhz4izz7LASWU4tTLu3GBsvhJ8ULSi3G",
      storage: {
        pending_ops: 219535,
        signers: ["tz1RVPjF88wjiZ7JhxvmLPRm6TTR9MHPAFPd", "tz1ajzeMEzKxM9H4keBxoD1JSQy3iGRoHPg5"],
        threshold: "1",
      },
    },
  ];

  describe("getAllMultiSigContracts", () => {
    it("fetches all multisig contracts", async () => {
      mockedContractsGetCount.mockResolvedValue(multisigContracts.length);
      mockedContractsGet.mockResolvedValue(multisigContracts);
      const result = await getAllMultisigContracts(GHOSTNET);

      expect(mockedContractsGetCount).toHaveBeenCalledTimes(1);
      expect(mockedContractsGetCount).toHaveBeenCalledWith(
        {
          kind: { eq: "smart_contract" },
          typeHash: { eq: TYPE_HASH },
          codeHash: { eq: CODE_HASH },
        },
        { baseUrl: GHOSTNET.tzktApiUrl }
      );
      expect(mockedContractsGet).toHaveBeenCalledTimes(1);
      expect(mockedContractsGet).toHaveBeenCalledWith(
        {
          kind: { eq: "smart_contract" },
          typeHash: { eq: TYPE_HASH },
          codeHash: { eq: CODE_HASH },
          select: { fields: ["id,address,storage"] },
          includeStorage: true,
          limit: 10000,
          offset: { pg: 0 },
        },
        { baseUrl: GHOSTNET.tzktApiUrl }
      );
      expect(
        result.map(({ id, address, storage: { pending_ops, signers, threshold } }) => ({
          id,
          address,
          storage: { pending_ops, signers, threshold },
        }))
      ).toEqual(expectedMockedMultisigContracts);
    });

    it("handles pagination", async () => {
      mockedContractsGetCount.mockResolvedValue(79123);
      mockedContractsGet.mockResolvedValue([]);

      await getAllMultisigContracts(GHOSTNET);

      expect(mockedContractsGetCount).toHaveBeenCalledTimes(1);
      expect(mockedContractsGetCount).toHaveBeenCalledWith(
        {
          kind: { eq: "smart_contract" },
          typeHash: { eq: TYPE_HASH },
          codeHash: { eq: CODE_HASH },
        },
        { baseUrl: GHOSTNET.tzktApiUrl }
      );

      expect(mockedContractsGet).toHaveBeenCalledTimes(8);
      range(8).forEach(index => {
        expect(mockedContractsGet).toHaveBeenCalledWith(
          {
            kind: { eq: "smart_contract" },
            typeHash: { eq: TYPE_HASH },
            codeHash: { eq: CODE_HASH },
            select: { fields: ["id,address,storage"] },
            includeStorage: true,
            limit: 10000,
            offset: { pg: index },
          },
          { baseUrl: GHOSTNET.tzktApiUrl }
        );
      });
    });
  });

  describe("getExistingContracts", () => {
    it.each(DefaultNetworks)(
      "on $name calls contractsGet with correct arguments",
      async network => {
        mockedContractsGet.mockResolvedValue(["pkh1", "pkh3"] as any);

        await getExistingContracts(["pkh1", "pkh2", "pkh3"], network);

        expect(mockedContractsGet).toHaveBeenCalledWith(
          {
            address: {
              in: ["pkh1,pkh2,pkh3"],
            },
            select: { fields: ["address"] },
            limit: 3,
          },
          { baseUrl: network.tzktApiUrl }
        );
      }
    );

    it("extracts contract addresses from the api response", async () => {
      mockedContractsGet.mockResolvedValue(["pkh1", "pkh3"] as any);

      const result = await getExistingContracts(["pkh1", "pkh2", "pkh3"], GHOSTNET);

      expect(result).toEqual(["pkh1", "pkh3"]);
    });
  });

  describe("getPendingOperations", () => {
    it("fetches pending operation", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        json: () =>
          Promise.resolve([
            {
              bigmap: 1,
              active: true,
              key: "2",
              value: { actions: "action2", approvals: [mockImplicitAddress(0).pkh] },
            },
          ]),
      } as Response);

      const result = await getPendingOperationsForMultisigs([1], GHOSTNET);
      expect(fetch).toHaveBeenCalledWith(
        `${GHOSTNET.tzktApiUrl}/v1/bigmaps/keys?active=true&bigmap.in=1&limit=10000`
      );
      expect(result).toEqual([
        {
          active: true,
          bigmap: 1,
          key: "2",
          value: { actions: "action2", approvals: ["tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h"] },
        },
      ]);
    });

    it("handles empty bigMaps", async () => {
      const result = await getPendingOperationsForMultisigs([], GHOSTNET);
      expect(fetch).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);
    });
  });
});
