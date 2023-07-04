import { MichelsonV1Expression } from "@taquito/rpc";
import { Address, ContractAddress } from "../../types/Address";

export type FA2TransferMethodArgs = {
  sender: Address;
  recipient: Address;
  contract: ContractAddress;
  tokenId: string;
  amount: string;
};

export type FA12TransferMethodArgs = Omit<FA2TransferMethodArgs, "tokenId">;

export type MultisigProposeMethodArgs = {
  contract: ContractAddress;
  lambdaActions: MichelsonV1Expression;
};

export type ApproveOrExecute = "approve" | "execute";

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
