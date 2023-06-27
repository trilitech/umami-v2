import { Accordion, Box } from "@chakra-ui/react";
import { range } from "lodash";
import React from "react";
import { MultisigAccount } from "../../../../types/Account";
import { useGetSortedMultisigPendingOperations } from "../../../../utils/hooks/multisigHooks";
import NoItems from "../../../NoItems";
import MultisigPendingAccordionItem from "./MultisigPendingAccordionItem";

export const MultisigPendingAccordion: React.FC<{
  account: MultisigAccount;
}> = ({ account }) => {
  const getMultisigPendingOps = useGetSortedMultisigPendingOperations();
  const pendingOperations = getMultisigPendingOps(account.address);
  if (pendingOperations.length === 0) {
    return <NoItems text="No multisig pending operations" small />;
  }
  return (
    <Box w="100%">
      <Accordion allowMultiple={true} defaultIndex={range(pendingOperations.length)}>
        {pendingOperations.map(operation => (
          <MultisigPendingAccordionItem
            key={operation.key}
            operation={operation}
            signers={account.signers}
            threshold={account.threshold}
          />
        ))}
      </Accordion>
    </Box>
  );
};

export default MultisigPendingAccordion;
