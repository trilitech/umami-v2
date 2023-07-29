import { Estimate } from "@taquito/taquito";
import { ImplicitAccount } from "../../types/Account";
import { FormOperations } from "../../components/sendForm/types";
import { TezosNetwork } from "../../types/TezosNetwork";
import {
  makeMultisigApproveOrExecuteMethod,
  makeMultisigProposeMethod,
  makeToolkit,
} from "./helpers";
import { operationsToBatchParams } from "./params";
import { MultisigApproveOrExecuteMethodArgs, MultisigProposeMethodArgs } from "./types";
import { makeBatchLambda } from "../../multisig/multisigUtils";

export const estimateMultisigPropose = async (
  params: MultisigProposeMethodArgs,
  signer: ImplicitAccount,
  network: TezosNetwork
): Promise<Estimate> => {
  const tezosToolkit = await makeToolkit({ type: "fake", signer, network });

  const propseMethod = await makeMultisigProposeMethod(params, tezosToolkit);

  return tezosToolkit.estimate.transfer(propseMethod.toTransferParams());
};

export const estimateMultisigApproveOrExecute = async (
  params: MultisigApproveOrExecuteMethodArgs,
  signer: ImplicitAccount,
  network: TezosNetwork
): Promise<Estimate> => {
  const tezosToolkit = await makeToolkit({ type: "fake", signer, network });

  const approveOrExecuteMethod = await makeMultisigApproveOrExecuteMethod(params, tezosToolkit);

  return tezosToolkit.estimate.transfer(approveOrExecuteMethod.toTransferParams());
};

export const estimateSingle = async (
  operation: FormOperations,
  network: TezosNetwork
): Promise<Estimate> => {
  return estimateBatch(operation, network).then(estimates => estimates[0]);
};

export const estimateBatch = async (
  operations: FormOperations,
  network: TezosNetwork
): Promise<Estimate[]> => {
  switch (operations.type) {
    case "implicit": {
      const batch = operationsToBatchParams(operations.content);

      const tezosToolkit = await makeToolkit({ type: "fake", signer: operations.signer, network });

      return tezosToolkit.estimate.batch(batch);
    }
    case "proposal": {
      const content = operations.content;

      const lambdaActions = makeBatchLambda(content);
      const estimation = await estimateMultisigPropose(
        {
          lambdaActions,
          contract: operations.sender.address,
        },

        operations.signer,
        network
      );
      return [estimation];
    }
  }
};
