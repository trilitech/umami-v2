import { Accordion, Box } from "@chakra-ui/react";
import { range } from "lodash";
import React from "react";
import { parseRawMichelson } from "../../../../multisig/decode/decodeLambda";
import { MultisigAccount } from "../../../../types/Account";
import { useGetPendingOperations } from "../../../../utils/hooks/multisigHooks";
import { useOperationsToOperationValues } from "../../../../utils/hooks/assetsHooks";
import { useSendFormModal } from "../../../../views/home/useSendFormModal";
import NoItems from "../../../NoItems";
import MultisigPendingAccordionItem from "./MultisigPendingAccordionItem";

export const MultisigPendingAccordion: React.FC<{
  account: MultisigAccount;
}> = ({ account }) => {
  const getPendingOperations = useGetPendingOperations();
  const pendingOperations = getPendingOperations(account);

  const { onOpen, modalElement } = useSendFormModal();

  const operationToOperationValues = useOperationsToOperationValues();

  if (pendingOperations.length === 0) {
    return <NoItems text="No multisig pending operations" small />;
  }

  return (
    <Box w="100%">
      <Accordion allowMultiple={true} defaultIndex={range(pendingOperations.length)}>
        {pendingOperations.map(operation => {
          return (
            <MultisigPendingAccordionItem
              onApproveOrExecute={({ mode }) => {
                const operations = parseRawMichelson(operation.rawActions);
                const operationValues = operationToOperationValues(operations, account.address.pkh);

                onOpen({
                  mode: {
                    data: {
                      batch: operationValues,
                      operationId: operation.id,
                    },

                    type: mode,
                  },
                });
              }}
              key={operation.id}
              operation={operation}
              signers={account.signers}
              threshold={account.threshold}
            />
          );
        })}
      </Accordion>
      {modalElement}
    </Box>
  );
};

export default MultisigPendingAccordion;
