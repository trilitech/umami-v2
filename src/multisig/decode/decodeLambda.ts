import { encodePubKey } from "@taquito/utils";
import { get } from "lodash";
import { Operation } from "../types";
import { batchHeadSchema, fa21chema2, fa2Schema, tezSchema } from "./schemas";

const TEZ_TOKEN_LENGTH = 6;
const FA2_TOKEN_LENGTH = 3;

export const parseTez = (michelson: any[]): Operation | null => {
  const result = tezSchema.safeParse(michelson.slice(0, TEZ_TOKEN_LENGTH));

  if (!result.success) {
    return null;
  }

  const recipient = result.data[0].args[1].bytes;

  const amount2 = result.data[2].args[1].int;

  const parsedRecipient = encodePubKey("00" + recipient);
  return {
    type: "tez",
    recipient: parsedRecipient,
    amount: amount2,
  };
};

const parseFa2 = (michelson: any[]): Operation | null => {
  const parseResult = fa2Schema.safeParse(michelson.slice(0, FA2_TOKEN_LENGTH));
  if (!parseResult.success) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lambdaRecipient, _, fa2Values] = parseResult.data;

  const unsafeData = fa2Values.args[1][1].args[1][0];

  const from = get(unsafeData, ["args", 0, "bytes"]);
  const to = get(unsafeData, ["args", 1, 0, "args", 0, "bytes"]);
  const token_id = get(unsafeData, ["args", 1, 0, "args", 1, "args", 0, "int"]);
  const amount = get(unsafeData, ["args", 1, 0, "args", 1, "args", 1, "int"]);

  if (from == null || to == null || token_id == null || amount == null) {
    return null;
  }

  return {
    type: "fa2",
    contract: encodePubKey(lambdaRecipient.args[1].bytes),
    sender: encodePubKey(from),
    recipient: encodePubKey(to),
    tokenId: token_id,
    amount,
  };
};

const parseFa1 = (michelson: any[]): any | null => {
  const parseResult = fa21chema2.safeParse(
    michelson.slice(0, FA2_TOKEN_LENGTH)
  );

  if (!parseResult.success) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lambdaRecipient, _, fa1Values] = parseResult.data;

  const unsafeData = fa1Values.args[1][1].args[1];

  const sender = get(unsafeData, ["args", 0, "bytes"]);
  const recipient = get(unsafeData, ["args", 1, "args", 0, "bytes"]);
  const amount = get(unsafeData, ["args", 1, "args", 1, "int"]);

  if (sender == null || recipient == null || amount == null) {
    return null;
  }

  return {
    type: "fa1.2",
    amount,
    contract: encodePubKey(lambdaRecipient.args[1].bytes),
    recipient: encodePubKey(recipient),
    sender: encodePubKey(sender),
  };
};

const parse = (michelson: any[], result: Operation[] = []): Operation[] => {
  if (michelson.length === 0) {
    return result;
  }

  const tez = parseTez(michelson);
  if (tez) {
    return parse(michelson.slice(TEZ_TOKEN_LENGTH), [...result, tez]);
  }

  const fa2 = parseFa2(michelson);
  if (fa2) {
    return parse(michelson.slice(FA2_TOKEN_LENGTH), [...result, fa2]);
  }

  const fa1 = parseFa1(michelson);

  if (fa1) {
    return parse(michelson.slice(FA2_TOKEN_LENGTH), [...result, fa1]);
  }

  return parse(michelson.slice(1), result);
};

const assertHead = (michelson: any[]) => {
  batchHeadSchema.parse(michelson.slice(0, 2));
};

export const decode = (michelson: any[]) => {
  assertHead(michelson);

  return parse(michelson.slice(2));
};
