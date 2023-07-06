import {
  BeaconMessageType,
  NetworkType,
  OperationRequestOutput,
  TezosOperationType,
} from "@airgap/beacon-wallet";
import { mockImplicitAddress } from "./factories";

export const objectOperationRequest: OperationRequestOutput = {
  appMetadata: {
    senderId: "RH5VAUmsa7u8",
    name: "objkt.com",
    icon: "https://assets.objkt.media/file/assets-002/objkt/objkt-logo.png",
  },
  id: "72304aa4-14ba-0dac-c03c-0661b289f040",
  version: "2",
  senderId: "RH5VAUmsa7u8",
  type: BeaconMessageType.OperationRequest,
  network: { type: NetworkType.MAINNET },
  operationDetails: [
    {
      kind: TezosOperationType.TRANSACTION,
      storage_limit: "350",
      amount: "3500000",
      destination: "KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC",
      parameters: {
        entrypoint: "fulfill_ask",
        value: { prim: "Pair", args: [{ int: "1232832" }, { prim: "None" }] },
      },
    },
  ],
  sourceAddress: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
};

export const mockBeaconDelegate = mockImplicitAddress(3).pkh;
export const objectOperationDelegationRequest: OperationRequestOutput = {
  appMetadata: {
    senderId: "id1",
    name: "some baker",
    icon: "http://mock",
  },
  id: "id2",
  version: "2",
  senderId: "id3",
  type: BeaconMessageType.OperationRequest,
  network: { type: NetworkType.MAINNET },
  operationDetails: [
    {
      kind: TezosOperationType.DELEGATION,
      storage_limit: "350",
      delegate: mockBeaconDelegate,
      fee: "3",
      gas_limit: "33",
    },
  ],
  sourceAddress: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
};

export const objectOperationBatchRequest: OperationRequestOutput = {
  appMetadata: {
    senderId: "id1",
    name: "some baker",
    icon: "http://mock",
  },
  id: "batchId",
  version: "2",
  senderId: "id3",
  type: BeaconMessageType.OperationRequest,
  network: { type: NetworkType.MAINNET },
  operationDetails: [
    {
      kind: TezosOperationType.DELEGATION,
      storage_limit: "350",
      delegate: mockBeaconDelegate,
      fee: "3",
      gas_limit: "33",
    },
    {
      kind: TezosOperationType.TRANSACTION,
      storage_limit: "350",
      amount: "8000000",
      destination: "KT1WvzYHCNBvDSdwafTHv7nJ1dWmZ8GCYuuC",
      parameters: {
        entrypoint: "fulfill_ask",
        value: { prim: "Pair", args: [{ int: "1232832" }, { prim: "None" }] },
      },
    },

    {
      kind: TezosOperationType.TRANSACTION,
      amount: "8000000",
      destination: mockImplicitAddress(6).pkh,
    },
  ],
  sourceAddress: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
};
