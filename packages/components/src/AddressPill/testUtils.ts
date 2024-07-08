import { type FA2Address } from "./types";
import { mockContractAddress } from "../../../tezos/src/testUtils";

export const mockFA2AddressKind = (index?: number): FA2Address => ({
  type: "fa2",
  pkh: mockContractAddress(index || 0).pkh,
  label: null,
});
