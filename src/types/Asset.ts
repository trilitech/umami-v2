type TokenBase = {
  contract: string;
  balance: string;
};

type TokenMetadata = {
  name?: string;
  symbol?: string;
  decimals?: string;
  iconUrl?: string;
};

type NFTMetadata = {
  name?: string;
  symbol?: string;
  displayUri: string;
};

export type FA12Token = {
  type: "fa1.2";
  metadata?: TokenMetadata;
} & TokenBase;

export type FA2Token = TokenBase & {
  type: "fa2";
  tokenId: string;
  metadata: TokenMetadata;
};
export type NFT = TokenBase & {
  type: "nft";
  tokenId: string;
  metadata: NFTMetadata;
  owner: string;
};

export const keepNFTs = (assets: Asset[]) => {
  return assets.filter((a) => a.type === "nft") as NFT[]; // This sucks
};
export const keepFA1s = (assets: Asset[]) => {
  return assets.filter((a) => a.type === "fa1.2") as FA12Token[]; // This sucks
};

export const keepFA2s = (assets: Asset[]) => {
  return assets.filter((a) => a.type === "fa2") as FA2Token[]; // This sucks
};

export const getTokenName = (t: FA2Token | FA12Token) => {
  if (t.metadata?.name) {
    return t.metadata?.name;
  }

  if (t.type === "fa1.2") {
    return DEFAULT_FA1_NAME;
  }

  if (t.type === "fa2") {
    return DEFAULT_FA2_NAME;
  }

  const error: never = t;
  throw error;
};

export const getTokenSymbol = (t: FA2Token | FA12Token) => {
  if (t.metadata?.symbol) {
    return t.metadata.symbol;
  }

  if (t.type === "fa1.2") {
    return DEFAULT_FA1_SYMBOL;
  }

  if (t.type === "fa2") {
    return DEFAULT_FA2_SYMBOL;
  }

  const error: never = t;
  throw error;
};

export const formatTokenAmount = (
  amountStr: string,
  decimals = DEFAULT_TOKEN_DECIMALS
) => {
  return Number(amountStr) / Math.pow(10, Number(decimals));
};

export const getTokenPrettyAmmount = (
  t: FA2Token | FA12Token,
  options?: { showSymbol?: boolean }
) => {
  const symbol = getTokenSymbol(t);
  const amount = t.balance;
  const decimals = t.metadata?.decimals;
  const trailingSymbol = options?.showSymbol ? ` ${symbol}` : "";
  const result = formatTokenAmount(amount, decimals);

  return `${result}${trailingSymbol}`;
};
export type Asset = FA12Token | FA2Token | NFT;

// We use the defaults for FA1.2 tokens as in V1
export const DEFAULT_FA1_NAME = "FA1.2 token";
export const DEFAULT_FA2_NAME = "FA2 token";
export const DEFAULT_FA1_SYMBOL = "FA1.2";
export const DEFAULT_FA2_SYMBOL = "FA2";
export const DEFAULT_TOKEN_DECIMALS = "4";
