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

export type OperationValue =
  | (TezMode & {
      value: {
        amount: number;
        sender: string;
        recipient: string;
      };
    })
  | (TokenMode & {
      value: {
        amount: number;
        sender: string;
        recipient: string;
      };
    })
  | (DelegationMode & {
      value: {
        sender: string;
        recipient?: string;
      };
    });

export type EstimatedOperation = {
  operation: OperationValue | OperationValue[];
  fee: number;
};

export type SignablePayload = string;
