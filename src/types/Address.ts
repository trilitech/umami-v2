export type ContractAddress = {
  type: "contract";
  pkh: string;
};

export type ImplicitAddress = {
  type: "implicit";
  pkh: string;
};

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

const isValidContractPkh = (pkh: string) => pkh.match(/^KT1\w+/);
const isValidImplicitPkh = (pkh: string) => pkh.match(/^tz[1234]\w+/);

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
