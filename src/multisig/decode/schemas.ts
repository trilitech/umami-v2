import { z } from "zod";

const caseInsensitiveLiteral = (label: string) => {
  return z.string().regex(new RegExp(`^${label}$`, "i"));
};

const prim = (label: string) => {
  return z.object({
    prim: caseInsensitiveLiteral(label),
  });
};

const pushKeyHashSchema = z.object({
  prim: z.literal("PUSH"),
  args: z.tuple([z.object({ prim: z.literal("key_hash") }), z.object({ bytes: z.string() })]),
});

const pushAddressSchema = z.object({
  prim: z.literal("PUSH"),
  args: z.tuple([z.object({ prim: z.literal("address") }), z.object({ bytes: z.string() })]),
});

const pair = <T extends z.ZodTypeAny, U extends z.ZodTypeAny>(first: T, second: U) => {
  return z.object({
    prim: z.literal("Pair"),
    args: z.tuple([first, second]),
  });
};

const contractZeroTezSchema = z.object({
  prim: z.literal("PUSH"),
  args: z.tuple([z.object({ prim: z.literal("mutez") }), z.object({ int: z.literal("0") })]),
});

const lambdaEndSchema = [prim("TRANSFER_TOKENS"), prim("CONS")];

const contractHeadSchema = z.object({
  prim: z.literal("CONTRACT"),
});

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

const pushMutezSchema = z.object({
  prim: z.literal("PUSH"),
  args: z.tuple([z.object({ prim: z.literal("mutez") }), z.object({ int: z.string() })]),
});

export const tezSchema = z.tuple([
  pushKeyHashSchema,
  prim("IMPLICIT_ACCOUNT"),
  pushMutezSchema,
  prim("UNIT"),
  ...lambdaEndSchema,
]);

export const contractTezSchema = z.tuple([
  pushAddressSchema,
  contractHeadSchema,
  z.tuple([prim("IF_NONE")]),
  pushMutezSchema,
  prim("UNIT"),
  ...lambdaEndSchema,
]);

export const setDelegateSchema = z.tuple([
  pushKeyHashSchema,
  prim("SOME"),
  prim("SET_DELEGATE"),
  prim("CONS"),
]);

export const removeDelegateSchema = z.tuple([
  z.object({
    prim: z.literal("NONE"),
    args: z.tuple([z.object({ prim: z.literal("key_hash") })]),
  }),
  prim("SET_DELEGATE"),
  prim("CONS"),
]);

export const fa2Schema = z.tuple([
  pushAddressSchema,
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
  ...lambdaEndSchema,
]);

export const fa1Schema = z.tuple([
  pushAddressSchema,
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
  ...lambdaEndSchema,
]);
