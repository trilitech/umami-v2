import { mockContractAddress } from "@umami/tezos";

import { type FA2Address } from "./types";

export const mockFA2AddressKind = (index?: number): FA2Address => ({
  type: "fa2",
  pkh: mockContractAddress(index || 0).pkh,
  label: null,
});
