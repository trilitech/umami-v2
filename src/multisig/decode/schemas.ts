import { z } from "zod";

const prim = (label: string) => {
  return z.object({
    prim: z.literal(label),
  });
};

/**
 * Lambda Recipient
 */
const pushKeyHashSchema = z.object({
  prim: z.literal("PUSH"),
  args: z.tuple([
    z.object({ prim: z.literal("key_hash") }),
    z.object({ bytes: z.string() }),
  ]),
});

const pushAddressSchema = z.object({
  prim: z.literal("PUSH"),
  args: z.tuple([
    z.object({ prim: z.literal("address") }),
    z.object({ bytes: z.string() }),
  ]),
});

export const lambdaRecipientSchema = z.union([
  pushKeyHashSchema,
  pushAddressSchema,
]);

/**
 * Head of batch
 */
export const batchHeadSchema = z.tuple([
  z.object({
    prim: z.literal("DROP"),
  }),
  z.object({
    prim: z.literal("NIL"),
    args: z.array(
      z.object({
        prim: z.literal("operation"),
      })
    ),
  }),
]);

/**
 * Tez
 */
export const tezSchema = z.tuple([
  prim("IMPLICIT_ACCOUNT"),
  z.object({
    args: z.tuple([prim("mutez"), z.object({ int: z.string() })]),
    prim: z.literal("PUSH"),
  }),
  prim("UNIT"),
  prim("TRANSFER_TOKENS"),
  prim("CONS"),
]);

/**
 * Contract head
 */
export const contractHeadSchema = z.object({
  prim: z.literal("CONTRACT"),
});

/**
 * FA2
 */
export const fa2Schema = z.object({
  prim: z.literal("IF_NONE"),
  args: z.tuple([
    z.tuple([prim("UNIT"), prim("FAILWITH")]),
    z.tuple([
      prim("PUSH"),
      z.object({
        prim: z.literal("PUSH"),
        args: z.tuple([
          prim("list"),
          z.tuple([
            // token transfer values live here
            z.any(),
          ]),
        ]),
      }),
      prim("TRANSFER_TOKENS"),
      prim("CONS"),
    ]),
  ]),
});

/**
 * FA1.2
 */
export const fa1Schema = z.object({
  prim: z.literal("IF_NONE"),
  args: z.tuple([
    z.tuple([prim("UNIT"), prim("FAILWITH")]),
    z.tuple([
      prim("PUSH"),
      z.object({
        prim: z.literal("PUSH"),
        args: z.tuple([
          prim("pair"),
          // token transfer values live here
          z.any(),
        ]),
      }),
      prim("TRANSFER_TOKENS"),
      prim("CONS"),
    ]),
  ]),
});
