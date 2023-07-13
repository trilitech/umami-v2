import { FA2Address } from "../components/AddressPill/types";
import { mockContractAddress } from "./factories";

export const mockFA2Address: FA2Address = {
  type: "fa2",
  pkh: mockContractAddress(0).pkh,
  label: null,
};
