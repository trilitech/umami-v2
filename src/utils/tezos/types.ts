export type FA2TokenTransferParams = {
  sender: string;
  recipient: string;
  contract: string;
  tokenId: string;
  amount: number;
};

export type coinCapResponseType = {
  data: {
    priceUsd?: number;
  };
};
