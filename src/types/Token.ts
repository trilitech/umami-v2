import * as tzktApi from "@tzkt/sdk-api";
import { z } from "zod";
import { Schema as AddressSchema } from "./Address";

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

export type RawTokenInfo = Omit<tzktApi.TokenInfo, "metadata"> & {
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
