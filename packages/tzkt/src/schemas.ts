import { z } from "zod";

export const AddressSchema = z.object({ address: z.string() });

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
