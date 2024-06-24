import { ValidationResult, validateAddress } from "@taquito/utils";

import { type Address, type ContractAddress, type ImplicitAddress } from "./types";

export const parsePkh = (pkh: string): Address => {
  if (isValidContractPkh(pkh)) {
    return parseContractPkh(pkh);
  }
  if (isValidImplicitPkh(pkh)) {
    return parseImplicitPkh(pkh);
  }
  throw new Error(`Cannot parse address type: ${pkh}`);
};

export const isAddressValid = (pkh: string) => validateAddress(pkh) === ValidationResult.VALID;

export const isValidContractPkh = (pkh: string) => isAddressValid(pkh) && pkh.match(/^KT1\w+/);

export const isValidImplicitPkh = (pkh: string) => isAddressValid(pkh) && pkh.match(/^tz[1234]\w+/);

export const parseContractPkh = (pkh: string): ContractAddress => {
  if (isValidContractPkh(pkh)) {
    return { type: "contract", pkh };
  }
  throw new Error(`Invalid contract address: ${pkh}`);
};

export const parseImplicitPkh = (pkh: string): ImplicitAddress => {
  if (isValidImplicitPkh(pkh)) {
    return { type: "implicit", pkh };
  }
  throw new Error(`Invalid implicit address: ${pkh}`);
};
