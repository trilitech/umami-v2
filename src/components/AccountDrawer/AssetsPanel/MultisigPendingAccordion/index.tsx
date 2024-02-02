import { Accordion, Box } from "@chakra-ui/react";
import { range } from "lodash";
import React from "react";

import { MultisigPendingAccordionItem } from "./MultisigPendingAccordionItem";
import { MultisigAccount } from "../../../../types/Account";
import { useGetPendingMultisigOperations } from "../../../../utils/hooks/multisigHooks";

export const MultisigPendingAccordion: React.FC<{
  account: MultisigAccount;
}> = ({ account }) => {
  const getPendingOperations = useGetPendingMultisigOperations();
  const pendingOperations = getPendingOperations(account);
  return (
    <Box width="100%">
      <Accordion allowMultiple={true} defaultIndex={range(pendingOperations.length)}>
        {pendingOperations.map(operation => (
          <MultisigPendingAccordionItem key={operation.id} operation={operation} sender={account} />
        ))}
      </Accordion>
    </Box>
  );
};
