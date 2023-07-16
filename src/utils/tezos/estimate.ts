import { Estimate } from "@taquito/taquito";
import { OperationValue } from "../../components/sendForm/types";
import { makeToolkit } from "../../types/ToolkitConfig";
import { FakeToolkitConfig } from "../../types/ToolkitConfig";
import { makeMultisigApproveOrExecuteMethod, makeMultisigProposeMethod } from "./helpers";
import { operationValuesToBatchParams } from "./params";
import { MultisigApproveOrExecuteMethodArgs, MultisigProposeMethodArgs } from "./types";

export const estimateMultisigPropose = async (
  params: MultisigProposeMethodArgs,
  config: FakeToolkitConfig
): Promise<Estimate> => {
  const signer = await makeToolkit(config);

  const propseMethod = await makeMultisigProposeMethod(params, signer);

  return signer.estimate.transfer(propseMethod.toTransferParams());
};

export const estimateMultisigApproveOrExecute = async (
  params: MultisigApproveOrExecuteMethodArgs,
  config: FakeToolkitConfig
): Promise<Estimate> => {
  const signer = await makeToolkit(config);

  const approveOrExecuteMethod = await makeMultisigApproveOrExecuteMethod(params, signer);

  return signer.estimate.transfer(approveOrExecuteMethod.toTransferParams());
};

export const estimateBatch = async (
  operations: OperationValue[],
  config: FakeToolkitConfig
): Promise<Estimate[]> => {
  const batch = await operationValuesToBatchParams(operations, config);

  const signer = await makeToolkit(config);

  return signer.estimate.batch(batch);
};
