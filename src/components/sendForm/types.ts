import { TransferParams } from "@taquito/taquito";
import { Asset } from "../../types/Asset";
import { Batch } from "../../utils/store/assetsSlice";
import type { BigNumber } from "bignumber.js";

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
        amount: BigNumber;
        sender: string;
        recipient: string;
        parameter?: TransferParams["parameter"];
      };
    })
  | (TokenMode & {
      value: {
        amount: BigNumber;
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
  fee: BigNumber;
};
