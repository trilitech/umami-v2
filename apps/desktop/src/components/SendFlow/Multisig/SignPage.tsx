import { ModalContent, ModalFooter } from "@chakra-ui/react";
import { type TezosToolkit } from "@taquito/taquito";
import { useDynamicModalContext } from "@umami/components";
import {
  type ApproveOrExecute,
  type EstimatedAccountOperations,
  type ImplicitAccount,
  executeOperations,
} from "@umami/core";
import { useAsyncActionHandler } from "@umami/state";
import { capitalize } from "lodash";
import { FormProvider, useForm } from "react-hook-form";

import { AdvancedSettingsAccordion } from "../../AdvancedSettingsAccordion";
import { BatchModalBody } from "../BatchModalBody";
import { SignButton } from "../SignButton";
import { SuccessStep } from "../SuccessStep";

export const SignPage = ({
  signer,
  operation,
  actionType,
  transactionCount,
}: {
  operation: EstimatedAccountOperations;
  actionType: ApproveOrExecute;
  signer: ImplicitAccount;
  // A single approve/execute `ContractCall` operation could contain multiple transactions
  // so we need to pass the transaction count by decoding the proposed multisig action separately
  transactionCount: number;
}) => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useDynamicModalContext();
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
