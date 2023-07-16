import { MichelsonV1Expression } from "@taquito/rpc";
import { ContractAddress } from "../../types/Address";

export type MultisigProposeMethodArgs = {
  contract: ContractAddress;
  lambdaActions: MichelsonV1Expression;
};

type ApproveOrExecute = "approve" | "execute";

export type MultisigApproveOrExecuteMethodArgs = {
  type: ApproveOrExecute;
  contract: ContractAddress;
  operationId: string;
};

export type coinCapResponseType = {
  data: {
    priceUsd?: number;
  };
};
