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

export type tzktGetSameContractResponseType = {
  balance: number;
  address: string;
  storage: {
    signers: [string];
  };
};
