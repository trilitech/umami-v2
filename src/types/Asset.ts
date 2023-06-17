import { BigNumber } from "bignumber.js";
import type { Token, TokenMetadata } from "./Token";
import { z } from "zod";
import { getIPFSurl } from "../utils/token/nftUtils";
import { TezosNetwork } from "@airgap/tezos";

const addressParser = z.object({ address: z.string() });

export type Asset = FA12Token | FA2Token | NFT;

const fa1TokenParser = z.object({
  standard: z.string().regex(/fa1\.2/i),
  contract: addressParser,
});

const fa1parser = z.object({
  balance: z.string(),
  token: fa1TokenParser,
});

const fa2TokenParser = z.object({
  standard: z.string().regex(/fa2/i),
  tokenId: z.string(),
  contract: addressParser,
});

const fa2parser = z.object({
  balance: z.string(),
  token: fa2TokenParser,
});

const nftTokenParser = z.object({
  id: z.number(),
  standard: z.string().regex(/fa2/i),
  tokenId: z.string(),
  contract: addressParser,
  totalSupply: z.string().optional(),
  metadata: z.object({
    displayUri: z.string(),
  }),
});

const nftParser = z.object({
  balance: z.string(),
  account: addressParser,
  token: nftTokenParser,
});

export const fromToken = (raw: Token): Asset | null => {
  const metadata = raw.token?.metadata;

  const fa1result = fa1parser.safeParse(raw);
  if (fa1result.success) {
    return {
      type: "fa1.2",
      metadata: metadata,
      balance: fa1result.data.balance,
      contract: fa1result.data.token.contract.address,
    };
  }

  if (!metadata) {
    console.log("Impossible state, FA2 metadata is empty");
    return null;
  }

  const nftResult = nftParser.safeParse(raw);
  if (nftResult.success) {
    return {
      metadata,
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

  const fa2result = fa2parser.safeParse(raw);
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

const defaultTokenName = (asset: FA12Token | FA2Token): string => {
  switch (asset.type) {
    case "fa1.2":
      return DEFAULT_FA1_NAME;
    case "fa2":
      return DEFAULT_FA2_NAME;
  }
};

export const tokenName = (asset: FA12Token | FA2Token): string => {
  return asset.metadata?.name || defaultTokenName(asset);
};

const defaultTokenSymbol = (asset: FA12Token | FA2Token): string => {
  switch (asset.type) {
    case "fa1.2":
      return DEFAULT_FA1_SYMBOL;
    case "fa2":
      return DEFAULT_FA2_SYMBOL;
  }
};

export const tokenSymbol = (asset: FA12Token | FA2Token): string => {
  return asset.metadata?.symbol || defaultTokenSymbol(asset);
};

export const httpIconUri = (asset: FA12Token | FA2Token): string | undefined => {
  let iconUri;
  if (asset.type === "fa1.2") {
    iconUri = asset.metadata?.icon;
  } else if (asset.type === "fa2") {
    iconUri = asset.metadata?.thumbnailUri;
  }
  return iconUri && getIPFSurl(iconUri);
};

export const getRealAmount = (asset: Asset, prettyAmount: string): BigNumber => {
  const amount = new BigNumber(prettyAmount);

  if (asset.type === "nft") {
    return amount;
  }

  const decimals =
    asset.metadata?.decimals === undefined ? DEFAULT_TOKEN_DECIMALS : asset.metadata.decimals;

  return amount.multipliedBy(new BigNumber(10).exponentiatedBy(decimals));
};

export type FA12Token = {
  type: "fa1.2";
  contract: string;
  balance: string;
  metadata?: TokenMetadata;
};

export type FA2Token = {
  type: "fa2";
  metadata?: TokenMetadata;
  contract: string;
  tokenId: string;
  balance: string;
};

export type NFT = {
  id: number;
  type: "nft";
  contract: string;
  tokenId: string;
  balance: string;
  owner: string;
  metadata: TokenMetadata;
  displayUri: string;
  totalSupply: string | undefined;
};

export const keepNFTs = (assets: Asset[]) => {
  return assets.filter((asset): asset is NFT => asset.type === "nft");
};
export const keepFA1s = (assets: Asset[]) => {
  return assets.filter((asset): asset is FA12Token => asset.type === "fa1.2");
};

export const keepFA2s = (assets: Asset[]) => {
  return assets.filter((asset): asset is FA2Token => asset.type === "fa2");
};

export const formatTokenAmount = (amountStr: string, decimals = DEFAULT_TOKEN_DECIMALS) => {
  return Number(amountStr) / Math.pow(10, Number(decimals));
};

export const tokenPrettyBalance = (
  token: FA2Token | FA12Token,
  options?: { showSymbol?: boolean }
) => {
  const symbol = tokenSymbol(token);
  const amount = token.balance;
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

// We use the defaults for FA1.2 tokens as in V1
export const DEFAULT_FA1_NAME = "FA1.2 token";
export const DEFAULT_FA2_NAME = "FA2 token";
export const DEFAULT_FA1_SYMBOL = "FA1.2";
export const DEFAULT_FA2_SYMBOL = "FA2";
export const DEFAULT_TOKEN_DECIMALS = "4";
