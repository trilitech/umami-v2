import { ModalContent, ModalFooter } from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import { capitalize } from "lodash";
import React, { useContext } from "react";

import { ImplicitAccount } from "../../../types/Account";
import { EstimatedAccountOperations } from "../../../types/AccountOperations";
import { ApproveOrExecute } from "../../../types/Operation";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { executeOperations } from "../../../utils/tezos";
import { DynamicModalContext } from "../../DynamicModal";
import { BatchModalBody } from "../BatchModalBody";
import { SignButton } from "../SignButton";
import { SuccessStep } from "../SuccessStep";

export const SignPage: React.FC<{
  operation: EstimatedAccountOperations;
  actionType: ApproveOrExecute;
  signer: ImplicitAccount;
  // A single approve/execute `ContractCall` operation could contain multiple transactions
  // so we need to pass the transaction count by decoding the proposed multisig action separately
  transactionCount: number;
}> = ({ signer, operation, actionType, transactionCount }) => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  // TODO: add advanced execute params component
  const approveOrExecute = (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(
      async () => {
        // TODO: add execute params
        const { opHash } = await executeOperations(
          { ...operation, estimates: form.watch("executeParams") },
          tezosToolkit
        );

        return openWith(<SuccessStep hash={opHash} />);
      },
      { title: `Failed ${actionType}` }
    );

  const title = `${capitalize(actionType)} transaction`;

  return (
    <ModalContent>
      <form>
        <BatchModalBody operation={operation} title={title} transactionCount={transactionCount} />

        <ModalFooter>
          <SignButton onSubmit={approveOrExecute} signer={signer} text={title} />
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
