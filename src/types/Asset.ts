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

export type FA12Token = { type: "fa1.2" } & TokenBase;

export type FA2Token = TokenBase & {
  type: "fa2";
  tokenId: string;
  metadata: FA2TokenMetadata;
};
export type NFT = TokenBase & {
  type: "nft";
  tokenId: string;
  metadata: NFTMetadata;
  owner: string;
};

export type Asset = FA12Token | FA2Token | NFT;
