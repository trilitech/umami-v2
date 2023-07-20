import * as tzktApi from "@tzkt/sdk-api";
import { BigNumber } from "bignumber.js";
import {
  Metadata,
  RawTokenInfo,
  Token,
  fromRaw as fromRawToken,
  NFT,
  FA2Token,
  FA12Token,
} from "./Token";
import { getIPFSurl } from "../utils/token/nftUtils";
import { TezosNetwork } from "@airgap/tezos";
import { RawAlias, RawPkh } from "./Address";

export type TokenBalance = { balance: string; contract: RawPkh; tokenId: string };
export type TokenBalanceWithToken = TokenBalance & Token;

export type RawTokenBalance = Omit<tzktApi.TokenBalance, "account" | "token"> & {
  account: RawAlias;
  token: RawTokenInfo;
};

export const fromRaw = (raw: RawTokenBalance): TokenBalanceWithToken | null => {
  const token = fromRawToken(raw.token);
  if (!token || !raw.balance) {
    return null;
  }
  return { balance: raw.balance, ...token };
};

export const eraseToken = (tokenBalance: TokenBalanceWithToken): TokenBalance => {
  const { balance, contract, tokenId } = tokenBalance;
  return { balance, contract, tokenId };
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

export const tokenDecimal = (asset: Token): string => {
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

export const getRealAmount = (asset: Token, prettyAmount: string): BigNumber => {
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
  tokenId: "0";
  balance: string;
  metadata?: Metadata;
};

export type FA2TokenBalance = {
  type: "fa2";
  metadata?: Metadata;
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
  metadata: Metadata;
  displayUri: string;
  totalSupply: string | undefined;
};

export const keepNFTs = (assets: TokenBalanceWithToken[]) => {
  return assets.filter((asset): asset is NFTBalance => asset.type === "nft");
};
export const keepFA1s = (assets: TokenBalanceWithToken[]) => {
  return assets.filter((asset): asset is FA12TokenBalance => asset.type === "fa1.2");
};

export const keepFA2s = (assets: TokenBalanceWithToken[]) => {
  return assets.filter((asset): asset is FA2TokenBalance => asset.type === "fa2");
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

export const artifactUri = (nft: NFTBalance): string => {
  return nft.metadata.artifactUri || nft.displayUri;
};

export const thumbnailUri = (nft: NFT): string => {
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
export const DEFAULT_TOKEN_DECIMALS = "0";
