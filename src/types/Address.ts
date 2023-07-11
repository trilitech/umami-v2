import { validateAddress, ValidationResult } from "@taquito/utils";
import { z } from "zod";

export type RawPkh = string;

export type ContractAddress = {
  type: "contract";
  pkh: RawPkh;
};

export type ImplicitAddress = {
  type: "implicit";
  pkh: RawPkh;
};

export const Schema = z.object({ address: z.string() });

export type Address = ContractAddress | ImplicitAddress;

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
