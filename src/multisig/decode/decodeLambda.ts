import { encodePubKey } from "@taquito/utils";
import { get } from "lodash";
import { Operation } from "../types";
import {
  batchHeadSchema,
  contractHeadSchema,
  fa1Schema,
  fa2Schema,
  lambdaRecipientSchema,
  tezSchema,
} from "./schemas";

export const parseTez = (michelson: any[]): Operation | null => {
  const [head, ...body] = michelson;
  const tezBody = body.slice(0, 5);

  const recipient = lambdaRecipientSchema.safeParse(head);

  if (!recipient.success) {
    return null;
  }

  const tezTransfer = tezSchema.safeParse(tezBody);

  if (!tezTransfer.success) {
    return null;
  }

  const amount = tezTransfer.data[1].args[1].int;

  const parsedRecipient = encodePubKey("00" + recipient.data.args[1].bytes);
  return {
    type: "tez",
    recipient: parsedRecipient,
    amount: amount,
  };
};

const parseFa2 = (michelson: any[]): Operation | null => {
  const [head, ...body] = michelson;
  const fa2Body = body.slice(0, 2);

  const contract = lambdaRecipientSchema.safeParse(head);

  if (!contract.success) {
    return null;
  }

  const [def, values] = fa2Body;

  const fa2Def = contractHeadSchema.safeParse(def);
  if (!fa2Def.success) {
    return null;
  }

  const fa2Values = fa2Schema.safeParse(values);
  if (!fa2Values.success) {
    return null;
  }

  const unsafeData = fa2Values.data.args[1][1].args[1][0];

  const from = get(unsafeData, ["args", 0, "bytes"]);
  const to = get(unsafeData, ["args", 1, 0, "args", 0, "bytes"]);
  const token_id = get(unsafeData, ["args", 1, 0, "args", 1, "args", 0, "int"]);
  const amount = get(unsafeData, ["args", 1, 0, "args", 1, "args", 1, "int"]);

  if (from == null || to == null || token_id == null || amount == null) {
    return null;
  }

  return {
    type: "fa2",
    contract: encodePubKey(contract.data.args[1].bytes),
    sender: encodePubKey(from),
    recipient: encodePubKey(to),
    tokenId: token_id,
    amount,
  };
};

const parseFa1 = (michelson: any[]): any | null => {
  const [head, ...body] = michelson;
  const fa2Body = body.slice(0, 2);

  const contract = lambdaRecipientSchema.safeParse(head);

  if (!contract.success) {
    return null;
  }

  const [def, values] = fa2Body;

  const fa2Def = contractHeadSchema.safeParse(def);
  if (!fa2Def.success) {
    return null;
  }

  const fa1Values = fa1Schema.safeParse(values);
  if (!fa1Values.success) {
    return null;
  }
  const unsafeData = fa1Values.data.args[1][1].args[1];

  const sender = get(unsafeData, ["args", 0, "bytes"]);
  const recipient = get(unsafeData, ["args", 1, "args", 0, "bytes"]);
  const amount = get(unsafeData, ["args", 1, "args", 1, "int"]);

  if (sender == null || recipient == null || amount == null) {
    return null;
  }

  return {
    type: "fa1.2",
    amount,
    contract: encodePubKey(contract.data.args[1].bytes),
    recipient: encodePubKey(recipient),
    sender: encodePubKey(sender),
  };
};

const TEZ_TOKEN_LENGTH = 6;
const FA2_TOKEN_LENGTH = 3;

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
