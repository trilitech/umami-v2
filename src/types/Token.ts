import type * as tzktApi from "@tzkt/sdk-api";
import BigNumber from "bignumber.js";
import { z } from "zod";

import { Schema as AddressSchema, type TzktAlias } from "./Address";
import { type Network } from "./Network";

// TzKT defines metadata as any, but we need to have at least some clarity of what can be inside
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
export type RawTokenInfo = tzktApi.TokenInfo & {
  contract: TzktAlias;
  metadata?: Metadata;
  tokenId: string;
};

const FA12TokenSchema = z.object({
  standard: z.string().regex(/^fa1\.2$/i),
  contract: AddressSchema,
});

const FA2TokenSchema = z.object({
  standard: z.string().regex(/^fa2$/i),
  tokenId: z.string(),
  contract: AddressSchema,
});

const NFTSchema = z.object({
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

export const fullId = (token: Token): string => `${token.contract}:${token.tokenId}`;

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

export const tokenNameSafe = (token: Token): string => tokenName(token) || defaultTokenName(token);

export const tokenName = (token: Token): string | undefined => token.metadata?.name;

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

export const tokenSymbolSafe = (token: Token): string =>
  tokenSymbol(token) || defaultTokenSymbol(token);

export const tokenSymbol = (token: Token): string | undefined => token.metadata?.symbol;

export const tokenDecimals = (asset: Token): string =>
  asset.metadata?.decimals ?? DEFAULT_TOKEN_DECIMALS;

export const getRealAmount = (token: Token, prettyAmount: string): string => {
  const amount = new BigNumber(prettyAmount);

  const decimals = tokenDecimals(token);

  return amount.multipliedBy(new BigNumber(10).exponentiatedBy(decimals)).toFixed();
};

export const formatTokenAmount = (amount: string, decimals = DEFAULT_TOKEN_DECIMALS): string => {
  const realAmount = BigNumber(amount).dividedBy(BigNumber(10).pow(decimals));
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: Number(decimals),
      maximumFractionDigits: Number(decimals),
    });
    return formatter.format(realAmount.toNumber());
  } catch (e) {
    console.warn(`Can't format token amount with decimals = ${decimals}`);
    // there are tokens with decimals > 1000 which is not supported by Intl.NumberFormat
    return formatTokenAmount(amount, "0");
  }
};

// TODO: rebuild, unusable (especially with NFTs)
export const tokenPrettyAmount = (
  amount: string,
  token: Token,
  options?: { showSymbol?: boolean }
) => {
  if (token.type === "nft") {
    return amount;
  }
  const symbol = tokenSymbolSafe(token);
  const decimals = token.metadata?.decimals;
  const trailingSymbol = options?.showSymbol ? ` ${symbol}` : "";
  const result = formatTokenAmount(amount, decimals);

  return `${result}${trailingSymbol}`;
};

export const artifactUri = (nft: NFT): string => nft.metadata.artifactUri || nft.displayUri;

export const thumbnailUri = (nft: NFT): string => nft.metadata.thumbnailUri || nft.displayUri;

export const mimeType = (nft: NFT) =>
  nft.metadata.formats?.find(format => format.uri === artifactUri(nft))?.mimeType;

export const royalties = (nft: NFT): Array<{ address: string; share: number }> => {
  const royalties = nft.metadata.royalties;
  if (!royalties) {
    return [];
  }

  const totalShares = Math.pow(10, Number(royalties.decimals));
  const shares = Object.entries(royalties.shares).map(([address, share]) => ({
    address: address,
    share: (Number(share) * 100) / totalShares,
  }));
  shares.sort((a, b) => (a.share < b.share ? 1 : -1));
  return shares;
};

export const metadataUri = (token: Token, network: Network) =>
  `${tokenUri(token, network)}/metadata`;

export const tokenUri = ({ contract, tokenId }: Token, network: Network) =>
  `${network.tzktExplorerUrl}/${contract}/tokens/${tokenId}`;

const DEFAULT_FA1_NAME = "FA1.2 token";
const DEFAULT_FA2_NAME = "FA2 token";
const DEFAULT_NFT_NAME = "NFT";
const DEFAULT_FA1_SYMBOL = "FA1.2";
const DEFAULT_FA2_SYMBOL = "FA2";
const DEFAULT_NFT_SYMBOL = "NFT";
const DEFAULT_TOKEN_DECIMALS = "0";
