import { ModalContent, ModalFooter } from "@chakra-ui/react";
import { type TezosToolkit } from "@taquito/taquito";
import { DynamicModalContext } from "@umami/components";
import {
  type ApproveOrExecute,
  type EstimatedAccountOperations,
  type ImplicitAccount,
  executeOperations,
} from "@umami/core";
import { useAsyncActionHandler } from "@umami/state";
import { capitalize } from "lodash";
import type React from "react";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
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
  const form = useForm({
    defaultValues: { executeParams: operation.estimates },
  });

  const estimatedOperations = {
    ...operation,
    estimates: form.watch("executeParams"),
  };

  const approveOrExecute = (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(
      async () => {
        const { opHash } = await executeOperations(estimatedOperations, tezosToolkit);

        return openWith(<SuccessStep hash={opHash} />);
      },
      { title: `Failed ${actionType}` }
    );

  const title = `${capitalize(actionType)} transaction`;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <BatchModalBody
            operation={estimatedOperations}
            title={title}
            transactionCount={transactionCount}
          >
            <AdvancedSettingsAccordion />
          </BatchModalBody>

          <ModalFooter>
            <SignButton onSubmit={approveOrExecute} signer={signer} text={title} />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
