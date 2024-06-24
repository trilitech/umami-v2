export type RawPkh = string;

export type BigmapId = number;

export type ContractAddress = {
  type: "contract";
  pkh: RawPkh;
};

export type ImplicitAddress = {
  type: "implicit";
  pkh: RawPkh;
};

export type Address = ContractAddress | ImplicitAddress;
