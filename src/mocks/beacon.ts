import {
  BeaconMessageType,
  NetworkType,
  OperationRequestOutput,
  TezosOperationType,
} from "@airgap/beacon-wallet";

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
