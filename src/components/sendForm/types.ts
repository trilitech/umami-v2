import { TransferParams } from "@taquito/taquito";
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

export type ProposalOperations = {
  type: "proposal";
  content: OperationValue[];
  signer: string;
};

export type ImplicitOperations = {
  type: "implicit";
  content: OperationValue[];
};

export type FormOperations = ProposalOperations | ImplicitOperations;

export type EstimatedOperation = {
  operations: FormOperations;
  fee: string;
};
