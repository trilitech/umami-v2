import { BigNumber } from "bignumber.js";
import type { Token, TokenMetadata } from "./Token";
import { z } from "zod";
import { getIPFSurl } from "../utils/token/nftUtils";
import { TezosNetwork } from "@airgap/tezos";

const addressSchema = z.object({ address: z.string() });

export type TokenBalance = FA12TokenBalance | FA2TokenBalance | NFTBalance;

const fa1TokenSchema = z.object({
  standard: z.string().regex(/^fa1\.2$/i),
  contract: addressSchema,
});

const fa1BalanceSchema = z.object({
  balance: z.string(),
  token: fa1TokenSchema,
});

const fa2TokenSchema = z.object({
  standard: z.string().regex(/^fa2$/i),
  tokenId: z.string(),
  contract: addressSchema,
});

const fa2BalanceSchema = z.object({
  balance: z.string(),
  token: fa2TokenSchema,
});

const nftTokenSchema = z.object({
  id: z.number(),
  standard: z.string().regex(/^fa2$/i),
  tokenId: z.string(),
  contract: addressSchema,
  totalSupply: z.string().optional(),
  metadata: z.object({
    displayUri: z.string(),
  }),
});

const nftBalanceSchema = z.object({
  balance: z.string(),
  account: addressSchema,
  token: nftTokenSchema,
});

export const fromToken = (raw: Token): TokenBalance | null => {
  const metadata = raw.token?.metadata;

  const fa1result = fa1BalanceSchema.safeParse(raw);
  if (fa1result.success) {
    return {
      type: "fa1.2",
      metadata: metadata,
      balance: fa1result.data.balance,
      contract: fa1result.data.token.contract.address,
    };
  }

  const nftResult = nftBalanceSchema.safeParse(raw);
  if (nftResult.success) {
    return {
      // if the nft has been parsed successfully then the metadata is definitely present
      metadata: metadata as TokenMetadata,
      type: "nft",
      id: nftResult.data.token.id,
      contract: nftResult.data.token.contract.address,
      tokenId: nftResult.data.token.tokenId,
      balance: nftResult.data.balance,
      owner: nftResult.data.account.address,
      displayUri: nftResult.data.token.metadata.displayUri,
      totalSupply: nftResult.data.token.totalSupply || undefined,
    };
  }

  const fa2result = fa2BalanceSchema.safeParse(raw);
  if (fa2result.success) {
    return {
      type: "fa2",
      metadata,
      contract: fa2result.data.token.contract.address,
      tokenId: fa2result.data.token.tokenId,
      balance: fa2result.data.balance,
    };
  }

  return null;
};

const defaultTokenName = (asset: TokenBalance): string => {
  switch (asset.type) {
    case "fa1.2":
      return DEFAULT_FA1_NAME;
    case "fa2":
      return DEFAULT_FA2_NAME;
    case "nft":
      return DEFAULT_NFT_NAME;
  }
};

export const tokenName = (asset: TokenBalance): string => {
  return asset.metadata?.name || defaultTokenName(asset);
};

const defaultTokenSymbol = (asset: TokenBalance): string => {
  switch (asset.type) {
    case "fa1.2":
      return DEFAULT_FA1_SYMBOL;
    case "fa2":
      return DEFAULT_FA2_SYMBOL;
    case "nft":
      return DEFAULT_NFT_SYMBOL;
  }
};

export const tokenSymbol = (asset: TokenBalance): string => {
  return asset.metadata?.symbol || defaultTokenSymbol(asset);
};

export const tokenDecimal = (asset: TokenBalance): string => {
  return asset.metadata?.decimals === undefined ? DEFAULT_TOKEN_DECIMALS : asset.metadata.decimals;
};

export const httpIconUri = (asset: FA12TokenBalance | FA2TokenBalance): string | undefined => {
  let iconUri;
  if (asset.type === "fa1.2") {
    iconUri = asset.metadata?.icon;
  } else if (asset.type === "fa2") {
    iconUri = asset.metadata?.thumbnailUri;
  }
  return iconUri && getIPFSurl(iconUri);
};

export const getRealAmount = (asset: TokenBalance, prettyAmount: string): BigNumber => {
  const amount = new BigNumber(prettyAmount);

  if (asset.type === "nft") {
    return amount;
  }

  const decimals = tokenDecimal(asset);

  return amount.multipliedBy(new BigNumber(10).exponentiatedBy(decimals));
};

export type FA12TokenBalance = {
  type: "fa1.2";
  contract: string;
  balance: string;
  metadata?: TokenMetadata;
};

export type FA2TokenBalance = {
  type: "fa2";
  metadata?: TokenMetadata;
  contract: string;
  tokenId: string;
  balance: string;
};

export type NFTBalance = {
  id: number; // TODO: replace with contract + tokenId
  type: "nft";
  contract: string;
  tokenId: string;
  balance: string;
  owner: string;
  metadata: TokenMetadata;
  displayUri: string;
  totalSupply: string | undefined;
};

export const keepNFTs = (assets: TokenBalance[]) => {
  return assets.filter((asset): asset is NFTBalance => asset.type === "nft");
};
export const keepFA1s = (assets: TokenBalance[]) => {
  return assets.filter((asset): asset is FA12TokenBalance => asset.type === "fa1.2");
};

export const keepFA2s = (assets: TokenBalance[]) => {
  return assets.filter((asset): asset is FA2TokenBalance => asset.type === "fa2");
};

export const formatTokenAmount = (amountStr: string, decimals = DEFAULT_TOKEN_DECIMALS) => {
  return Number(amountStr) / Math.pow(10, Number(decimals));
};

export const tokenPrettyBalance = (
  token: FA2TokenBalance | FA12TokenBalance,
  options?: { showSymbol?: boolean }
) => {
  const symbol = tokenSymbol(token);
  const amount = token.balance;
  const decimals = token.metadata?.decimals;
  const trailingSymbol = options?.showSymbol ? ` ${symbol}` : "";
  const result = formatTokenAmount(amount, decimals);

  return `${result}${trailingSymbol}`;
};

export const artifactUri = (nft: NFTBalance): string => {
  return nft.metadata.artifactUri || nft.displayUri;
};

export const thumbnailUri = (nft: NFTBalance): string => {
  return nft.metadata.thumbnailUri || nft.displayUri;
};

export const mimeType = (nft: NFTBalance) => {
  return nft.metadata.formats?.find(format => format.uri === artifactUri(nft))?.mimeType;
};

export const royalties = (nft: NFTBalance): Array<{ address: string; share: number }> => {
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

export const metadataUri = (nft: NFTBalance, network: TezosNetwork) => {
  return `https://${network}.tzkt.io/${nft.contract}/tokens/${nft.tokenId}/metadata`;
};

// We use the defaults for FA1.2 tokens as in V1
export const DEFAULT_FA1_NAME = "FA1.2 token";
export const DEFAULT_FA2_NAME = "FA2 token";
export const DEFAULT_NFT_NAME = "NFT";
export const DEFAULT_FA1_SYMBOL = "FA1.2";
export const DEFAULT_FA2_SYMBOL = "FA2";
export const DEFAULT_NFT_SYMBOL = "NFT";
export const DEFAULT_TOKEN_DECIMALS = "4";
