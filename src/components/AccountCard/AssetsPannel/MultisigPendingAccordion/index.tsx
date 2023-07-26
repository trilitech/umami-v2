import { Accordion, Box } from "@chakra-ui/react";
import { range } from "lodash";
import React from "react";
import { MultisigAccount } from "../../../../types/Account";
import { useGetPendingOperations } from "../../../../utils/hooks/multisigHooks";
import NoItems from "../../../NoItems";
import MultisigPendingAccordionItem from "./MultisigPendingAccordionItem";

export const MultisigPendingAccordion: React.FC<{
  account: MultisigAccount;
}> = ({ account }) => {
  const getPendingOperations = useGetPendingOperations();
  const pendingOperations = getPendingOperations(account);
  if (pendingOperations.length === 0) {
    return <NoItems text="No multisig pending operations" small />;
  }
  return (
    <Box w="100%">
      <Accordion allowMultiple={true} defaultIndex={range(pendingOperations.length)}>
        {pendingOperations.map(operation => (
          <MultisigPendingAccordionItem
            key={operation.id}
            operation={operation}
            account={account}
          />
        ))}
      </Accordion>
    </Box>
  );
};

export default MultisigPendingAccordion;
