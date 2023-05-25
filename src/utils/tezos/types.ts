export type FA2TransferMethodArgs = {
  sender: string;
  recipient: string;
  contract: string;
  tokenId: string;
  amount: string;
};

export type FA12TransferMethodArgs = Omit<FA2TransferMethodArgs, "tokenId">;

export type coinCapResponseType = {
  data: {
    priceUsd?: number;
  };
};
