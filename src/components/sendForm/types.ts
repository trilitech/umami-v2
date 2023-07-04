import { TransferParams } from "@taquito/taquito";
import { Asset } from "../../types/Asset";
import { ApproveOrExecute } from "../../utils/tezos/types";

type TezMode = { type: "tez" };

type TokenMode = {
  type: "token";
  data: Asset;
};

export type DelegationMode = {
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

type ApproveMode = {
  type: "approve";
  data: {
    batch: OperationValue[];
    operationId: string;
  };
};

type ExecuteMode = {
  type: "execute";
  data: {
    batch: OperationValue[];
    operationId: string;
  };
};
export type SendFormMode =
  | TezMode
  | TokenMode
  | DelegationMode
  | BatchMode
  | ExecuteMode
  | ApproveMode;

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

export type ProposeOperations = {
  type: "proposal";
  content: OperationValue[];
  signer: string;
};

export type ApproveOrExecuteOperations = {
  type: ApproveOrExecute;
  content: OperationValue[];
  operationId: string;
  signer: string;
};

export type ImplicitOperations = {
  type: "implicit";
  content: OperationValue[];
};

export type FormOperations = ProposeOperations | ApproveOrExecuteOperations | ImplicitOperations;

export type EstimatedOperation = {
  operations: FormOperations;
  fee: string;
};
