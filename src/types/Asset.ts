type TokenBase = {
  contract: string;
  balance: string;
};

type FA2TokenMetadata = {
  name?: string;
  symbol?: string;
  decimals?: string;
};

type NFTMetadata = {
  name?: string;
  symbol?: string;
  displayUri: string;
};

export type FA12Token = TokenBase;
export type FA2Token = TokenBase & {
  tokenId: string;
  metadata: FA2TokenMetadata;
};
export type NFT = TokenBase & { tokenId: string; metadata: NFTMetadata };

export type Asset = FA12Token | FA2Token | NFT;
