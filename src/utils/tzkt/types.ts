export type tzktGetAddressResponseType = {
  type: "user" | "delegate" | "contract" | "ghost" | "rollup" | "smart_rollup" | "empty";
};

export type RawTzktGetSameMultisigsItem = {
  address: string;
  storage: {
    signers: string[];
    threshold: string;
    pending_ops: number;
  };
};

export type tzktGetSameMultisigsResponseType = RawTzktGetSameMultisigsItem[];

export type tzktGetBigMapKeysResponseType = {
  active: boolean;
  key: string | null;
  value: {
    actions: string;
    approvals: string[];
  } | null;
}[];

export type RawTzktGetBigMapKeysItem = {
  bigmap: number;
  active: boolean;
  key: string | null;
  value: {
    actions: string;
    approvals: string[];
  } | null;
};

export type RawTzktGetBigMapKeys = RawTzktGetBigMapKeysItem[];
