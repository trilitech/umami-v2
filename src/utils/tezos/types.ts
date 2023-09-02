import { MichelsonV1Expression } from "@taquito/rpc";
import { ContractAddress } from "../../types/Address";

export type MultisigProposeMethodArgs = {
  contract: ContractAddress;
  lambdaActions: MichelsonV1Expression;
};

export type ApproveOrExecute = "approve" | "execute";

export type coinCapResponseType = {
  data: {
    priceUsd?: number;
  };
};
