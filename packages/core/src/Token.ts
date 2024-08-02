import { type Network } from "@umami/tezos";
import {
  FA12TokenSchema,
  FA2TokenSchema,
  NFTSchema,
  type RawTzktTokenInfo,
  type RawTzktTokenMetadata,
} from "@umami/tzkt";
import BigNumber from "bignumber.js";
import repeat from "lodash/repeat";

export type TokenId = string;

export type FA12Token = {
  type: "fa1.2";
  contract: string;
  tokenId: "0"; // TzKT uses "0" as the tokenId for FA1.2 tokens
  metadata?: RawTzktTokenMetadata;
};

export type FA2Token = {
  type: "fa2";
  contract: string;
  tokenId: string;
  metadata?: RawTzktTokenMetadata;
};

export type NFT = {
  id: number; // TODO: replace with contract + tokenId
  type: "nft";
  contract: string;
  tokenId: string;
  metadata: RawTzktTokenMetadata;
  displayUri: string;
  totalSupply: string | undefined;
};

export type Token = FA12Token | FA2Token | NFT;

export const fromRawToken = (rawToken: RawTzktTokenInfo): Token | null => {
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
      metadata: metadata as RawTzktTokenMetadata,
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
  } catch (_) {
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

export const getSmallestUnit = (decimals: number): string => {
  if (decimals < 0) {
    console.warn("Decimals cannot be negative");
    decimals = 0;
  }

  const leadingZeroes = decimals === 0 ? "" : "0." + repeat("0", decimals - 1);
  return `${leadingZeroes}1`;
};

const DEFAULT_FA1_NAME = "FA1.2 token";
const DEFAULT_FA2_NAME = "FA2 token";
const DEFAULT_NFT_NAME = "NFT";
const DEFAULT_FA1_SYMBOL = "FA1.2";
const DEFAULT_FA2_SYMBOL = "FA2";
const DEFAULT_NFT_SYMBOL = "NFT";
const DEFAULT_TOKEN_DECIMALS = "0";
