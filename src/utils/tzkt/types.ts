export type tzktGetAddressResponseType = {
  type: "user" | "delegate" | "contract" | "ghost" | "rollup" | "smart_rollup" | "empty";
};

export type tzktGetSameMultisigsResponseType = {
  balance: number;
  address: string;
  storage: {
    signers: string[];
    threshold: string;
    pending_ops: number;
  };
}[];

export type tzktGetBigMapKeysResponseType = {
  active: boolean;
  key: string | null;
  value: {
    actions: string;
    approvals: string[];
  } | null;
}[];
