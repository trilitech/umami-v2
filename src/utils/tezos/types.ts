export type FA2TransferMethodArgs = {
  sender: string;
  recipient: string;
  contract: string;
  tokenId: string;
  amount: number;
};

export type FA12TransferMethodArgs = Omit<FA2TransferMethodArgs, "tokenId">;

export type coinCapResponseType = {
  data: {
    priceUsd?: number;
  };
};

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
