import { InMemorySigner } from "@taquito/signer";
import axios from "axios";

import {
  getPublicKeyPairFromSk,
  isAccountRevealed,
  operationToTaquitoOperation,
  operationsToBatchParams,
  operationsToWalletParams,
} from "./helpers";
import { executeParams } from "../../mocks/executeParams";
import {
  mockContractAddress,
  mockDelegationOperation,
  mockFA12Operation,
  mockImplicitAccount,
  mockImplicitAddress,
  mockMultisigAccount,
  mockNftOperation,
  mockTezOperation,
  mockUndelegationOperation,
} from "../../mocks/factories";
import { EstimatedAccountOperations, makeAccountOperations } from "../../types/AccountOperations";
import { MAINNET } from "../../types/Network";
import { ContractCall, ContractOrigination } from "../../types/Operation";
jest.mock("@taquito/signer");
jest.mock("./fakeSigner");
jest.mock("axios");

const mockedAxios = jest.mocked(axios);
const mockSk = "mockSk";
describe("tezos utils helpers", () => {
  it("getPkAndPkhFromSk", async () => {
    await getPublicKeyPairFromSk(mockSk);
    expect(InMemorySigner).toHaveBeenCalledTimes(1);
  });

  describe("isAccountRevealed", () => {
    it("returns true for a revealed account", async () => {
      const mockResponse = {
        data: {
          type: "user",
          revealed: true,
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await isAccountRevealed(mockImplicitAddress(0).pkh, MAINNET);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${MAINNET.tzktApiUrl}/v1/accounts/${mockImplicitAddress(0).pkh}`
      );
      expect(result).toEqual(true);
    });

    it("returns false for unrevealed account", async () => {
      const mockResponse = {
        data: {
          type: "user",
          revealed: false,
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await isAccountRevealed(mockImplicitAddress(0).pkh, MAINNET);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${MAINNET.tzktApiUrl}/v1/accounts/${mockImplicitAddress(0).pkh}`
      );
      expect(result).toEqual(false);
    });

    it("returns false for empty response", async () => {
      const mockResponse = {
        data: {
          type: "empty",
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await isAccountRevealed(mockImplicitAddress(0).pkh, MAINNET);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${MAINNET.tzktApiUrl}/v1/accounts/${mockImplicitAddress(0).pkh}`
      );
      expect(result).toEqual(false);
    });
  });

  describe("operationToTaquitoOperation", () => {
    it("tez", () => {
      expect(operationToTaquitoOperation(mockTezOperation(0))).toEqual({
        amount: 0,
        kind: "transaction",
        mutez: true,
        to: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
      });
    });

    it("fa1.2", () => {
      expect(operationToTaquitoOperation(mockFA12Operation(0))).toEqual({
        amount: 0,
        kind: "transaction",
        to: "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
        parameter: {
          entrypoint: "transfer",
          value: {
            args: [
              {
                string: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
              },
              {
                args: [
                  {
                    string: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
                  },

                  {
                    int: "0",
                  },
                ],
                prim: "Pair",
              },
            ],
            prim: "Pair",
          },
        },
      });
    });

    it("fa2", () => {
      expect(operationToTaquitoOperation(mockNftOperation(0))).toEqual({
        amount: 0,
        kind: "transaction",
        to: "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
        parameter: {
          entrypoint: "transfer",
          value: [
            {
              args: [
                {
                  string: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
                },
                [
                  {
                    args: [
                      {
                        string: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
                      },
                      {
                        args: [
                          {
                            int: "0",
                          },
                          {
                            int: "0",
                          },
                        ],
                        prim: "Pair",
                      },
                    ],
                    prim: "Pair",
                  },
                ],
              ],
              prim: "Pair",
            },
          ],
        },
      });
    });

    it("delegation", () => {
      expect(operationToTaquitoOperation(mockDelegationOperation(0))).toEqual({
        delegate: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
        kind: "delegation",
        source: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
      });
    });

    it("undelegation", () => {
      expect(operationToTaquitoOperation(mockUndelegationOperation(0))).toEqual({
        kind: "delegation",
        delegate: undefined,
        source: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
      });
    });

    describe("contract_origination", () => {
      it("converts an origination with a plain JS storage object", () => {
        const operation: ContractOrigination = {
          type: "contract_origination",
          sender: mockImplicitAddress(0),
          code: [{ prim: "unit" }],
          storage: { some: { nested: "storage" } },
        };

        expect(operationToTaquitoOperation(operation)).toEqual({
          code: [
            {
              prim: "unit",
            },
          ],
          kind: "origination",
          storage: {
            some: {
              nested: "storage",
            },
          },
        });
      });

      it("converts an origination with a valid Michelson storage object", () => {
        const operation: ContractOrigination = {
          type: "contract_origination",
          sender: mockImplicitAddress(0),
          code: [{ prim: "unit" }],
          storage: {
            prim: "Pair",
            args: [
              {
                prim: "Pair",
                args: [
                  [],
                  [
                    {
                      prim: "Elt",
                      args: [
                        {
                          string: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
                        },
                        {
                          int: "100000",
                        },
                      ],
                    },
                  ],
                ],
              },
              {
                prim: "Pair",
                args: [
                  {
                    string: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
                  },
                  [],
                ],
              },
            ],
          },
        };

        expect(operationToTaquitoOperation(operation)).toEqual({
          code: [
            {
              prim: "unit",
            },
          ],
          kind: "origination",
          init: operation.storage,
        });
      });
    });

    it("contract_call", () => {
      const operation: ContractCall = {
        type: "contract_call",
        contract: mockContractAddress(0),
        amount: "10",
        entrypoint: "test",
        args: [{ prim: "unit" }],
      };

      expect(operationToTaquitoOperation(operation)).toEqual({
        amount: 10,
        kind: "transaction",
        mutez: true,
        parameter: {
          entrypoint: "test",
          value: [
            {
              prim: "unit",
            },
          ],
        },
        to: "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
      });
    });
  });

  describe("operationsToBatchParams", () => {
    describe("implicit", () => {
      it("1 operation", () => {
        const accountOperations = {
          ...makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
            mockTezOperation(0),
          ]),
          estimates: [executeParams({ fee: 123 })],
        };
        expect(operationsToWalletParams(accountOperations)).toEqual([
          {
            amount: 0,
            kind: "transaction",
            mutez: true,
            to: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
            ...executeParams({ fee: 123 }),
          },
        ]);
      });

      it(">1 operations", () => {
        const accountOperations = {
          ...makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
            mockTezOperation(0),
            mockDelegationOperation(0),
          ]),
          estimates: [executeParams({ fee: 123 })],
        };
        expect(operationsToBatchParams(accountOperations)).toEqual([
          {
            amount: 0,
            kind: "transaction",
            mutez: true,
            to: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
          },
          {
            delegate: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
            kind: "delegation",
            source: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
          },
        ]);
      });
    });

    describe("multisig", () => {
      it("1 operation", () => {
        const accountOperations = {
          ...makeAccountOperations(mockMultisigAccount(0), mockImplicitAccount(0), [
            mockTezOperation(0),
          ]),
          estimates: [executeParams({ fee: 123 })],
        };
        expect(operationsToWalletParams(accountOperations)).toEqual([
          {
            amount: 0,
            kind: "transaction",
            mutez: true,
            parameter: {
              entrypoint: "propose",
              value: [
                {
                  prim: "DROP",
                },
                {
                  args: [
                    {
                      prim: "operation",
                    },
                  ],
                  prim: "NIL",
                },
                {
                  args: [
                    {
                      prim: "key_hash",
                    },
                    {
                      string: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
                    },
                  ],
                  prim: "PUSH",
                },
                {
                  prim: "IMPLICIT_ACCOUNT",
                },
                {
                  args: [
                    {
                      prim: "mutez",
                    },
                    {
                      int: "0",
                    },
                  ],
                  prim: "PUSH",
                },
                {
                  prim: "UNIT",
                },
                {
                  prim: "TRANSFER_TOKENS",
                },
                {
                  prim: "CONS",
                },
              ],
            },
            to: "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
            ...executeParams({ fee: 123 }),
          },
        ]);
      });

      it(">1 operations", () => {
        const accountOperations = {
          ...makeAccountOperations(mockMultisigAccount(0), mockImplicitAccount(0), [
            mockTezOperation(0),
            {
              ...mockDelegationOperation(0),
              sender: mockMultisigAccount(0).address,
            },
          ]),
          estimates: [executeParams({ fee: 123 })],
        };
        expect(operationsToWalletParams(accountOperations)).toEqual([
          {
            amount: 0,
            kind: "transaction",
            mutez: true,
            parameter: {
              entrypoint: "propose",
              value: [
                { prim: "DROP" },
                { args: [{ prim: "operation" }], prim: "NIL" },
                {
                  args: [{ prim: "key_hash" }, { string: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf" }],
                  prim: "PUSH",
                },
                { prim: "IMPLICIT_ACCOUNT" },
                { args: [{ prim: "mutez" }, { int: "0" }], prim: "PUSH" },
                { prim: "UNIT" },
                { prim: "TRANSFER_TOKENS" },
                { prim: "CONS" },
                {
                  args: [{ prim: "key_hash" }, { string: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf" }],
                  prim: "PUSH",
                },
                { prim: "SOME" },
                { prim: "SET_DELEGATE" },
                { prim: "CONS" },
              ],
            },
            to: "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
            ...executeParams({ fee: 123 }),
          },
        ]);
      });
    });
  });

  test("operationsToWalletParams", () => {
    const operations: EstimatedAccountOperations = {
      ...makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
        mockTezOperation(0),
        mockDelegationOperation(0),
      ]),
      estimates: [executeParams({ fee: 123 }), executeParams({ fee: 456, storageLimit: 123 })],
    };

    expect(operationsToWalletParams(operations)).toEqual([
      {
        amount: 0,
        fee: 123,
        gasLimit: 0,
        kind: "transaction",
        mutez: true,
        storageLimit: 0,
        to: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
      },
      {
        delegate: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
        fee: 456,
        gasLimit: 0,
        kind: "delegation",
        source: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
        storageLimit: 123,
      },
    ]);
  });
});
