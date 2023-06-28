import { Address } from "../../types/Address";

export type BaseAccountFilterProps = {
  onSelect: (address: Address) => void;
  onRemove: (address: Address) => void;
  selected?: Address[];
  isDisabled?: boolean;
};
