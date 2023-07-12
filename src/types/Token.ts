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
