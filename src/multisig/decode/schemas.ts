import { z } from "zod";

const caseInsensitiveLiteral = (label: string) => {
  return z.string().regex(new RegExp(`^${label}$`, "i"));
};

const prim = (label: string) => {
  return z.object({
    prim: caseInsensitiveLiteral(label),
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

const pair = <T extends z.ZodTypeAny, U extends z.ZodTypeAny>(
  first: T,
  second: U
) => {
  return z.object({
    prim: z.literal("Pair"),
    args: z.tuple([first, second]),
  });
};

const contractZeroTezSchema = z.object({
  prim: z.literal("PUSH"),
  args: z.tuple([
    z.object({ prim: z.literal("mutez") }),
    z.object({ int: z.literal("0") }),
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
  lambdaRecipientSchema,
  prim("IMPLICIT_ACCOUNT"),
  z.object({
    prim: z.literal("PUSH"),
    args: z.tuple([
      z.object({ prim: z.literal("mutez") }),
      z.object({ int: z.string() }),
    ]),
  }),
  prim("UNIT"),
  prim("TRANSFER_TOKENS"),
  prim("CONS"),
]);

// TODO: add contract tez schema

/**
 * Contract head
 */
export const contractHeadSchema = z.object({
  prim: z.literal("CONTRACT"),
});

/**
 * FA2
 */

export const fa2Schema = z.tuple([
  lambdaRecipientSchema,
  contractHeadSchema,
  z.tuple([prim("IF_NONE")]),
  contractZeroTezSchema,
  z.object({
    prim: z.literal("PUSH"),
    args: z.tuple([
      prim("list"), // arg types
      // FA2 allows to include a few transactions in a batch
      z.array(
        pair(
          z.object({ bytes: z.string({ description: "from" }) }),
          z.array(
            pair(
              z.object({ bytes: z.string({ description: "to" }) }),
              pair(
                z.object({ int: z.string({ description: "token_id" }) }),
                z.object({ int: z.string({ description: "amount" }) })
              )
            )
          )
        )
      ),
    ]),
  }),
  prim("TRANSFER_TOKENS"),
  prim("CONS"),
]);

/**
 * FA1.2
 */

export const fa1Schema = z.tuple([
  lambdaRecipientSchema,
  contractHeadSchema,
  z.tuple([prim("IF_NONE")]),
  contractZeroTezSchema,
  z.object({
    prim: z.literal("PUSH"),
    args: z.tuple([
      prim("Pair"), // arg types
      pair(
        z.object({ bytes: z.string({ description: "from" }) }),
        pair(
          z.object({ bytes: z.string({ description: "to" }) }),
          z.object({ int: z.string({ description: "amount" }) })
        )
      ),
    ]),
  }),
  prim("TRANSFER_TOKENS"),
  prim("CONS"),
]);
