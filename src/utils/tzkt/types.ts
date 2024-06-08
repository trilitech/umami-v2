import type { TzktAlias } from "../../types/Address";

export type RawTzktAccountType =
  | "user"
  | "delegate"
  | "contract"
  | "ghost"
  | "rollup"
  | "smart_rollup"
  | "empty";

export type RawTzktBlock = {
  level: number;
  cycle: number;
};

export type RawTzktUnstakeRequest = {
  cycle: number;
  finalizableAmount: number;
  staker: TzktAlias;
};

export type RawTzktGetSameMultisigsItem = {
  address: string;
  storage: {
    signers: string[];
    threshold: string;
    pending_ops: number; //bigmap id for the operations
  };
};

export type RawTzktGetSameMultisigs = RawTzktGetSameMultisigsItem[];

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
