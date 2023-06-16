import { TransferParams } from "@taquito/taquito";
import { Common, Delegation, TezOperation as LambdaTezOperation } from "../../multisig/types";
import { Asset } from "../../types/Asset";

type TezMode = { type: "tez" };

type TokenMode = {
  type: "token";
  data: Asset;
};

type DelegationMode = {
  type: "delegation";
  data?: {
    undelegate: boolean;
  };
};

type BatchMode = {
  type: "batch";
  data: {
    batch: OperationValue[];
  };
};
export type SendFormMode = TezMode | TokenMode | DelegationMode | BatchMode;

export type TezOperation = TezMode & {
  value: {
    amount: string;
    sender: string;
    recipient: string;
    parameter?: TransferParams["parameter"];
  };
};

type TokenOperation = TokenMode & {
  value: {
    amount: string;
    sender: string;
    recipient: string;
  };
};

export type DelegationOperation = DelegationMode & {
  value: {
    sender: string;
    recipient?: string;
  };
};

export type OperationValue = TezOperation | TokenOperation | DelegationOperation;

export type EstimatedOperation = {
  operations: OperationValue[];
  fee: string;
};

export type BatchOperation =
  | Common
  | (Delegation & { sender: string })
  | (LambdaTezOperation & { parameter?: TransferParams["parameter"]; sender: string });
