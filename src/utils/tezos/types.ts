import { MichelsonV1Expression } from "@taquito/rpc";

export type FA2TransferMethodArgs = {
  sender: string;
  recipient: string;
  contract: string;
  tokenId: string;
  amount: string;
};

export type FA12TransferMethodArgs = Omit<FA2TransferMethodArgs, "tokenId">;

export type MultisigProposeMethodArgs = {
  contract: string;
  lambdaActions: MichelsonV1Expression;
};

type ApproveOrExecute = "approve" | "execute";

export type MultisigApproveOrExecuteMethodArgs = {
  type: ApproveOrExecute;
  contract: string;
  operationId: string;
};

export type coinCapResponseType = {
  data: {
    priceUsd?: number;
  };
};
