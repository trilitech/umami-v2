import * as tzktApi from "@tzkt/sdk-api";
import { z } from "zod";
import { Schema as AddressSchema } from "./Address";
import BigNumber from "bignumber.js";
import { getIPFSurl } from "../utils/token/nftUtils";
import { TezosNetwork } from "./TezosNetwork";

// TzKT defines metadada as any, but we need to have at least some clarity of what can be inside
export type Metadata = {
  name?: string;
  symbol?: string;
  decimals?: string;
  description?: string;
  artifactUri?: string;
  displayUri?: string;
  thumbnailUri?: string;
  icon?: string;
  externalUri?: string;
  isBooleanAmount?: boolean;
  shouldPreferSymbol?: boolean;
  isTransferable?: boolean;
  creators?: string[];
  tags?: string[];
  rights?: string;
  royalties?: {
    shares: {
      [prop: string]: string;
    };
    decimals: string;
  };
  attributes?: Array<{
    name: string;
    value: string;
  }>;
  date?: string;
  type?: string;
  rarity?: string;
  language?: string;
  formats?: Array<{
    uri?: string;
    fileName?: string;
    fileSize?: string;
    mimeType?: string;
  }>;
};

// All the fields in TzKT are optional and it doesn't differ from the type `any`
// meaning that you can pass in anything as RawTokenInfo and it will be accepted
// but no token can exist without a contract. It provides at least some type safety
export type RawTokenInfo = Omit<tzktApi.TokenInfo, "contract" | "metadata"> & {
  contract: tzktApi.Alias;
  metadata?: Metadata;
};

export const FA12TokenSchema = z.object({
  standard: z.string().regex(/^fa1\.2$/i),
  contract: AddressSchema,
});

export const FA2TokenSchema = z.object({
  standard: z.string().regex(/^fa2$/i),
  tokenId: z.string(),
  contract: AddressSchema,
});

export const NFTSchema = z.object({
  id: z.number(),
  standard: z.string().regex(/^fa2$/i),
  tokenId: z.string(),
  contract: AddressSchema,
  totalSupply: z.string().optional(),
  metadata: z.object({
    displayUri: z.string(),
    decimals: z.void().or(z.string().regex(/^0$/)),
  }),
});

export type TokenId = string;

export type FA12Token = {
  type: "fa1.2";
  contract: string;
  tokenId: "0"; // TzKT uses "0" as the tokenId for FA1.2 tokens
  metadata?: Metadata;
};

export type FA2Token = {
  type: "fa2";
  contract: string;
  tokenId: string;
  metadata?: Metadata;
};

export type NFT = {
  id: number; // TODO: replace with contract + tokenId
  type: "nft";
  contract: string;
  tokenId: string;
  metadata: Metadata;
  displayUri: string;
  totalSupply: string | undefined;
};

export type Token = FA12Token | FA2Token | NFT;

export const fromRaw = (rawToken: RawTokenInfo): Token | null => {
  const metadata = rawToken.metadata;
  if (rawToken.standard === "fa1.2") {
    const fa1result = FA12TokenSchema.safeParse(rawToken);
    if (fa1result.success) {
      return {
        type: "fa1.2",
        metadata: metadata,
        contract: fa1result.data.contract.address,
        tokenId: "0",
      };
    }
    console.warn("Invalid FA1 token: " + JSON.stringify(rawToken));

    return null;
  }

  const nftResult = NFTSchema.safeParse(rawToken);
  if (nftResult.success) {
    return {
      // if the nft has been parsed successfully then the metadata is definitely present
      metadata: metadata as Metadata,
      type: "nft",
      id: nftResult.data.id,
      contract: nftResult.data.contract.address,
      tokenId: nftResult.data.tokenId,
      displayUri: nftResult.data.metadata.displayUri,
      totalSupply: nftResult.data.totalSupply,
    };
  }

  const fa2result = FA2TokenSchema.safeParse(rawToken);
  if (fa2result.success) {
    return {
      type: "fa2",
      metadata,
      contract: fa2result.data.contract.address,
      tokenId: fa2result.data.tokenId,
    };
  }

  console.warn("Invalid FA2 token: " + JSON.stringify(rawToken));
  return null;
};

export const fullId = (token: Token): string => {
  // TODO: remove condition when token id becomes 0 for fa1.2
  return `${token.contract}:${"tokenId" in token ? token.tokenId : "0"}`;
};

const defaultTokenName = (asset: Token): string => {
  switch (asset.type) {
    case "fa1.2":
      return DEFAULT_FA1_NAME;
    case "fa2":
      return DEFAULT_FA2_NAME;
    case "nft":
      return DEFAULT_NFT_NAME;
  }
};

export const tokenName = (asset: Token): string => {
  return asset.metadata?.name || defaultTokenName(asset);
};

const defaultTokenSymbol = (token: Token): string => {
  switch (token.type) {
    case "fa1.2":
      return DEFAULT_FA1_SYMBOL;
    case "fa2":
      return DEFAULT_FA2_SYMBOL;
    case "nft":
      return DEFAULT_NFT_SYMBOL;
  }
};

export const tokenSymbol = (token: Token): string => {
  return token.metadata?.symbol || defaultTokenSymbol(token);
};

export const tokenDecimals = (asset: Token): string => {
  return asset.metadata?.decimals === undefined ? DEFAULT_TOKEN_DECIMALS : asset.metadata.decimals;
};

export const httpIconUri = (asset: FA12Token | FA2Token): string | undefined => {
  let iconUri;
  switch (asset.type) {
    case "fa1.2":
      iconUri = asset.metadata?.icon;
      break;
    case "fa2":
      iconUri = asset.metadata?.thumbnailUri;
      break;
  }
  return iconUri && getIPFSurl(iconUri);
};

export const getRealAmount = (asset: Token, prettyAmount: string): BigNumber => {
  const amount = new BigNumber(prettyAmount);

  if (asset.type === "nft") {
    return amount;
  }

  const decimals = tokenDecimals(asset);

  return amount.multipliedBy(new BigNumber(10).exponentiatedBy(decimals));
};

export const formatTokenAmount = (amountStr: string, decimals = DEFAULT_TOKEN_DECIMALS) => {
  return Number(amountStr) / Math.pow(10, Number(decimals));
};

export const tokenPrettyBalance = (
  amount: string,
  token: FA2Token | FA12Token,
  options?: { showSymbol?: boolean }
) => {
  const symbol = tokenSymbol(token);
  const decimals = token.metadata?.decimals;
  const trailingSymbol = options?.showSymbol ? ` ${symbol}` : "";
  const result = formatTokenAmount(amount, decimals);

  return `${result}${trailingSymbol}`;
};

export const artifactUri = (nft: NFT): string => {
  return nft.metadata.artifactUri || nft.displayUri;
};

export const thumbnailUri = (nft: NFT): string => {
  return nft.metadata.thumbnailUri || nft.displayUri;
};

export const mimeType = (nft: NFT) => {
  return nft.metadata.formats?.find(format => format.uri === artifactUri(nft))?.mimeType;
};

export const royalties = (nft: NFT): Array<{ address: string; share: number }> => {
  const royalties = nft.metadata.royalties;
  if (!royalties) {
    return [];
  }

  const totalShares = Math.pow(10, Number(royalties.decimals));
  const shares = Object.entries(royalties.shares).map(([address, share]) => {
    return { address: address, share: (Number(share) * 100) / totalShares };
  });
  shares.sort((a, b) => (a.share < b.share ? 1 : -1));
  return shares;
};

export const metadataUri = (nft: NFT, network: TezosNetwork) => {
  return `https://${network}.tzkt.io/${nft.contract}/tokens/${nft.tokenId}/metadata`;
};

export const DEFAULT_FA1_NAME = "FA1.2 token";
export const DEFAULT_FA2_NAME = "FA2 token";
export const DEFAULT_NFT_NAME = "NFT";
export const DEFAULT_FA1_SYMBOL = "FA1.2";
export const DEFAULT_FA2_SYMBOL = "FA2";
export const DEFAULT_NFT_SYMBOL = "NFT";
export const DEFAULT_TOKEN_DECIMALS = "0";
