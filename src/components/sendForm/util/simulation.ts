import { TezosNetwork } from "@airgap/tezos";
import { Estimate } from "@taquito/taquito";
import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { parseContractPkh } from "../../../types/Address";
import { estimateBatch, estimateMultisigPropose } from "../../../utils/tezos";
import { sumEstimations } from "../../../views/batch/batchUtils";
import { FormOperations, ProposalOperations } from "../types";
import { toLambdaOperation } from "./toLambdaOperation";

const makeMultisigProposalSimulation = async (
  operation: ProposalOperations,
  network: TezosNetwork,
  getPk: (pkh: string) => string
) => {
  const content = operation.content;
  const signerPk = getPk(operation.signer);
  const signerPkh = operation.signer;
  const firstOp = content[0];
  const multisigContract = parseContractPkh(firstOp.value.sender);

  const lambdaActions = await makeBatchLambda(
    content.map(toLambdaOperation),
    TezosNetwork.GHOSTNET
  );
  const result = await estimateMultisigPropose(
    {
      lambdaActions,
      contract: multisigContract,
    },

    signerPk,
    signerPkh,
    network
  );
  return result;
};

const getTotalFee = (estimate: Estimate[] | Estimate) =>
  String(Array.isArray(estimate) ? sumEstimations(estimate) : estimate.suggestedFeeMutez);

export const makeSimulation = (
  operation: FormOperations,
  getPk: (pkh: string) => string,
  network: TezosNetwork
) => {
  if (operation.type === "proposal") {
    return makeMultisigProposalSimulation(operation, network, getPk).then(getTotalFee);
  }
  const implicitOps = operation.content;
  const sender = implicitOps[0].value.sender;

  const pk = getPk(sender);
  return estimateBatch(implicitOps, sender, pk, network).then(getTotalFee);
};
