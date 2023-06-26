import { Accordion, Box } from "@chakra-ui/react";
import { range } from "lodash";
import React from "react";
import { MultisigAccount } from "../../../../types/Account";
import { useGetMultisigPendingOperations } from "../../../../utils/hooks/multisigHooks";
import MultisigPendingAccordionItem from "./MultisigPendingAccordionItem";

export const MultisigPendingAccordion: React.FC<{
  account: MultisigAccount;
}> = ({ account }) => {
  const getMultisigPendingOps = useGetMultisigPendingOperations();
  const pendingOperations = getMultisigPendingOps(account.address);
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
