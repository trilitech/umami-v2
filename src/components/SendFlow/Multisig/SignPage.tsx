import React, { useContext } from "react";

import { ModalContent, ModalFooter } from "@chakra-ui/react";
import { ApproveOrExecute } from "../../../utils/tezos/types";
import { ImplicitAccount } from "../../../types/Account";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { DynamicModalContext } from "../../DynamicModal";
import { TezosToolkit } from "@taquito/taquito";
import { AccountOperations } from "../../sendForm/types";
import { executeOperations } from "../../../utils/tezos";
import { SuccessStep } from "../../sendForm/steps/SuccessStep";
import SignButton from "../../sendForm/components/SignButton";
import { BigNumber } from "bignumber.js";
import { capitalize } from "lodash";
import BatchModalBody from "../BatchModalBody";

export const SignPage: React.FC<{
  fee: BigNumber;
  operation: AccountOperations;
  actionType: ApproveOrExecute;
  signer: ImplicitAccount;
  // A single approve/execute `ContractCall` operation could contain multiple transactions
  // so we need to pass the transaction count by decoding the proposed multisig action separately
  transactionCount: number;
}> = ({ signer, fee, operation, actionType, transactionCount }) => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  const approveOrExecute = (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(
      async () => {
        const { opHash } = await executeOperations(operation, tezosToolkit);

        openWith(<SuccessStep hash={opHash} />);
      },
      { title: `Failed ${actionType}` }
    );

  const title = `${capitalize(actionType)} transaction`;

  return (
    <ModalContent>
      <form>
        <BatchModalBody
          fee={fee}
          title={title}
          signerAddress={signer.address}
          transactionCount={transactionCount}
        />

        <ModalFooter>
          <SignButton onSubmit={approveOrExecute} signer={signer} text={title} />
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
export default SignPage;
