export type tzktGetAddressResponseType = {
  type:
    | "user"
    | "delegate"
    | "contract"
    | "ghost"
    | "rollup"
    | "smart_rollup"
    | "empty";
};

export type tzktGetSameMultisigsResponseType = {
  balance: number;
  address: string;
  storage: {
    signers: string[];
    pending_ops: number;
  };
}[];
