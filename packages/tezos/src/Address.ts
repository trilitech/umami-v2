import { ValidationResult, validateAddress } from "@taquito/utils";
import { CustomError } from "@umami/utils";

import {
  type Address,
  type ContractAddress,
  type ImplicitAddress,
  type SmartRollupAddress,
} from "./types";

export const parsePkh = (pkh: string): Address => {
  if (isValidContractPkh(pkh)) {
    return parseContractPkh(pkh);
  }
  if (isValidImplicitPkh(pkh)) {
    return parseImplicitPkh(pkh);
  }
  if (isValidSmartRollupPkh(pkh)) {
    return parseSmartRollupPkh(pkh);
  }
  throw new CustomError(`Cannot parse address type: ${pkh}`);
};

export const isAddressValid = (pkh: string) => validateAddress(pkh) === ValidationResult.VALID;

export const isValidContractPkh = (pkh: string) => isAddressValid(pkh) && !!pkh.match(/^KT1\w+/);

export const isValidImplicitPkh = (pkh: string) =>
  isAddressValid(pkh) && !!pkh.match(/^tz[1234]\w+/);

export const isValidSmartRollupPkh = (pkh: string) => isAddressValid(pkh) && !!pkh.match(/^sr1\w+/);

export const parseContractPkh = (pkh: string): ContractAddress => {
  if (isValidContractPkh(pkh)) {
    return { type: "contract", pkh };
  }
  throw new CustomError(`Invalid contract address: ${pkh}`);
};

export const parseImplicitPkh = (pkh: string): ImplicitAddress => {
  if (isValidImplicitPkh(pkh)) {
    return { type: "implicit", pkh };
  }
  throw new CustomError(`Invalid implicit address: ${pkh}`);
};

export const parseSmartRollupPkh = (pkh: string): SmartRollupAddress => {
  if (isValidSmartRollupPkh(pkh)) {
    return { type: "smart_rollup", pkh };
  }
  throw new CustomError(`Invalid smart rollup address: ${pkh}`);
};
