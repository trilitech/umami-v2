export type FA2TokenTransferParams = {
  sender: string;
  recipient: string;
  contract: string;
  tokenId: string;
  amount: number;
};

export type FA12TokenTransferParams = Omit<FA2TokenTransferParams, "tokenId">;

export type coinCapResponseType = {
  data: {
    priceUsd?: number;
  };
};
