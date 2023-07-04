import { TezosNetwork } from "@airgap/tezos";
import { Estimate } from "@taquito/taquito";
import { makeBatchLambda } from "../../../multisig/multisigUtils";
import { parseContractPkh } from "../../../types/Address";
import {
  estimateBatch,
  estimateMultisigApproveOrExecute,
  estimateMultisigPropose,
} from "../../../utils/tezos";
import { sumEstimations } from "../../../views/batch/batchUtils";
import { FormOperations, ProposeOperations } from "../types";
import { toLambdaOperation } from "./toLambdaOperation";

const makeMultisigProposalSimulation = async (
  operation: ProposeOperations,
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
  switch (operation.type) {
    case "proposal":
      return makeMultisigProposalSimulation(operation, network, getPk).then(getTotalFee);
    case "approve":
    case "execute": {
      const signerPk = getPk(operation.signer);
      const signerPkh = operation.signer;

      return estimateMultisigApproveOrExecute(
        {
          type: operation.type,
          contract: {
            type: "contract",
            pkh: operation.content[0].value.sender,
          },
          operationId: operation.operationId,
        },
        signerPk,
        signerPkh,
        network
      ).then(getTotalFee);
    }
    case "implicit": {
      const implicitOps = operation.content;
      const sender = implicitOps[0].value.sender;

      const pk = getPk(sender);
      return estimateBatch(implicitOps, sender, pk, network).then(getTotalFee);
    }
  }
};
