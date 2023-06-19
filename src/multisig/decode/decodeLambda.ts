import { encodePubKey } from "@taquito/utils";
import { Operation } from "../types";
import {
  batchHeadSchema,
  contractTezSchema,
  fa1Schema,
  fa2Schema,
  removeDelegateSchema,
  setDelegateSchema,
  tezSchema,
} from "./schemas";
import type { MichelsonV1Expression } from "@taquito/rpc";
import { parseContractPkh, parseImplicitPkh, parsePkh } from "../../types/Address";

const toPkh = (addressBytes: string): string => {
  if (addressBytes.length === 42) {
    // in most of cases, tz1/2/3 addresses are returned not as 44 bytes, but as 42.
    // most likely, the reason is that the first byte are always 0
    // and it's done either for memory saving purposes or just because 0s at the left can be skipped
    addressBytes = "00" + addressBytes;
  }
  return encodePubKey(addressBytes);
};

export const parseTez = (michelson: MichelsonV1Expression[]): Operation => {
  const parseResult = tezSchema.parse(michelson);

  const to = parseResult[0].args[1].bytes;
  const amount = parseResult[2].args[1].int;

  return {
    type: "tez",
    recipient: parsePkh(toPkh(to)),
    amount,
  };
};

export const parseTezContract = (michelson: MichelsonV1Expression[]): Operation => {
  const parseResult = contractTezSchema.parse(michelson);

  const to = parseResult[0].args[1].bytes;
  const amount = parseResult[3].args[1].int;

  return {
    type: "tez",
    recipient: parsePkh(toPkh(to)),
    amount,
  };
};

const parseFa2 = (michelson: MichelsonV1Expression[]): Operation[] => {
  const parseResult = fa2Schema.parse(michelson);
  const contractAddress = parseContractPkh(toPkh(parseResult[0].args[1].bytes));
  const operations = parseResult[4].args[1];

  return operations.flatMap(operation => {
    const from = operation.args[0].bytes;

    return operation.args[1].map(destination => {
      const to = destination.args[0].bytes;
      const tokenId = destination.args[1].args[0].int;
      const amount = destination.args[1].args[1].int;

      return {
        type: "fa2",
        contract: contractAddress,
        sender: parsePkh(toPkh(from)),
        recipient: parsePkh(toPkh(to)),
        tokenId,
        amount,
      };
    });
  });
};

const parseFa1 = (michelson: MichelsonV1Expression[]): Operation => {
  const parseResult = fa1Schema.parse(michelson);

  const lambdaRecipient = parseResult[0];
  const entrypointArgs = parseResult[4].args[1];

  const from = entrypointArgs.args[0].bytes;
  const to = entrypointArgs.args[1].args[0].bytes;
  const amount = entrypointArgs.args[1].args[1].int;

  return {
    type: "fa1.2",
    amount,
    contract: parseContractPkh(toPkh(lambdaRecipient.args[1].bytes)),
    recipient: parsePkh(toPkh(to)),
    sender: parsePkh(toPkh(from)),
  };
};

const parseSetDelegate = (michelson: MichelsonV1Expression[]): Operation => {
  const parseResult = setDelegateSchema.parse(michelson);

  return {
    type: "delegation",
    recipient: parseImplicitPkh(toPkh(parseResult[0].args[1].bytes)),
  };
};

const parseRemoveDelegate = (_michelson: MichelsonV1Expression[]): Operation => {
  return { type: "delegation" };
};

const parsings = [
  { schema: tezSchema, parsingFn: parseTez },
  { schema: contractTezSchema, parsingFn: parseTezContract },
  { schema: fa2Schema, parsingFn: parseFa2 },
  { schema: fa1Schema, parsingFn: parseFa1 },
  { schema: setDelegateSchema, parsingFn: parseSetDelegate },
  { schema: removeDelegateSchema, parsingFn: parseRemoveDelegate },
];

const parse = (michelson: MichelsonV1Expression[], acc: Operation[] = []): Operation[] => {
  if (michelson.length === 0) {
    return acc;
  }

  for (let i = 0; i < parsings.length; i++) {
    const { schema, parsingFn } = parsings[i];
    const parseResult = schema.safeParse(michelson.slice(0, schema.items.length));
    if (!parseResult.success) {
      continue;
    }

    const parsed = parsingFn(parseResult.data);
    return parse(michelson.slice(schema.items.length), [...acc, ...[parsed].flat()]);
  }

  throw new Error(`Unrecognized michelson element: ${JSON.stringify(michelson[0])}`);
};

const assertHead = (michelson: MichelsonV1Expression[]) => {
  batchHeadSchema.parse(michelson.slice(0, 2));
};

export const decode = (michelson: MichelsonV1Expression[]) => {
  assertHead(michelson);

  return parse(michelson.slice(2));
};
