import { encodePubKey } from "@taquito/utils";
import { Operation } from "../types";
import { batchHeadSchema, fa1Schema, fa2Schema, tezSchema } from "./schemas";
import type { MichelsonV1Expression } from "@taquito/rpc";

const TEZ_TOKEN_LENGTH = 6;
const FA_TOKEN_LENGTH = 7;

export const parseTez = (michelson: MichelsonV1Expression[]): Operation | null => {
  const parseResult = tezSchema.safeParse(michelson.slice(0, TEZ_TOKEN_LENGTH));

  if (!parseResult.success) {
    return null;
  }

  const recipient = parseResult.data[0].args[1].bytes;

  const amount = parseResult.data[2].args[1].int;

  const parsedRecipient = encodePubKey("00" + recipient);
  return {
    type: "tez",
    recipient: parsedRecipient,
    amount,
  };
};

const parseFa2 = (michelson: MichelsonV1Expression[]): Operation[] => {
  const parseResult = fa2Schema.safeParse(michelson.slice(0, FA_TOKEN_LENGTH));
  if (!parseResult.success) {
    return [];
  }

  const lambdaRecipient = parseResult.data[0];
  const operations = parseResult.data[4].args[1];

  return operations.flatMap(operation => {
    const from = operation.args[0].bytes;

    return operation.args[1].map(destination => {
      const to = destination.args[0].bytes;
      const tokenId = destination.args[1].args[0].int;
      const amount = destination.args[1].args[1].int;

      return {
        type: "fa2",
        contract: encodePubKey(lambdaRecipient.args[1].bytes),
        sender: encodePubKey(from),
        recipient: encodePubKey(to),
        tokenId,
        amount,
      };
    });
  });
};

const parseFa1 = (michelson: MichelsonV1Expression[]): any | null => {
  const parseResult = fa1Schema.safeParse(michelson.slice(0, FA_TOKEN_LENGTH));

  if (!parseResult.success) {
    return null;
  }

  const lambdaRecipient = parseResult.data[0]
  const entrypointArgs = parseResult.data[4].args[1];

  const from = entrypointArgs.args[0].bytes;
  const to = entrypointArgs.args[1].args[0].bytes;
  const amount =  entrypointArgs.args[1].args[1].int;

  return {
    type: "fa1.2",
    amount,
    contract: encodePubKey(lambdaRecipient.args[1].bytes),
    recipient: encodePubKey(to),
    sender: encodePubKey(from),
  };
};

const parse = (michelson: MichelsonV1Expression[], result: Operation[] = []): Operation[] => {
  if (michelson.length === 0) {
    return result;
  }

  const tez = parseTez(michelson);
  if (tez) {
    return parse(michelson.slice(TEZ_TOKEN_LENGTH), [...result, tez]);
  }

  const fa2 = parseFa2(michelson);
  if (fa2.length > 0) {
    return parse(michelson.slice(FA_TOKEN_LENGTH), [...result, ...fa2]);
  }

  const fa1 = parseFa1(michelson);

  if (fa1) {
    return parse(michelson.slice(FA_TOKEN_LENGTH), [...result, fa1]);
  }

  throw new Error(
    `Unrecognized michelson element: ${JSON.stringify(michelson[0])}`
  );
};

const assertHead = (michelson: MichelsonV1Expression[]) => {
  batchHeadSchema.parse(michelson.slice(0, 2));
};

export const decode = (michelson: MichelsonV1Expression[]) => {
  assertHead(michelson);

  return parse(michelson.slice(2));
};
