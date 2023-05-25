import { TransferParams } from "@taquito/taquito";
import { Asset } from "../../types/Asset";
import { Batch } from "../../utils/store/assetsSlice";

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
    batch: Batch;
  };
};
export type SendFormMode = TezMode | TokenMode | DelegationMode | BatchMode;

type TezOperation = TezMode & {
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

type DelegationOperation = DelegationMode & {
  value: {
    sender: string;
    recipient?: string;
  };
};

export type OperationValue =
  | TezOperation
  | TokenOperation
  | DelegationOperation;

export type EstimatedOperation = {
  operation: OperationValue | OperationValue[];
  fee: string;
};
