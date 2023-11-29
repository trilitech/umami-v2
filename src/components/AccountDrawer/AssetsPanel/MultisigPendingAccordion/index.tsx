import { Accordion, Box } from "@chakra-ui/react";
import { range } from "lodash";
import React from "react";
import { MultisigAccount } from "../../../../types/Account";
import { useGetPendingMultisigOperations } from "../../../../utils/hooks/multisigHooks";
import NoItems from "../../../NoItems";
import MultisigPendingAccordionItem from "./MultisigPendingAccordionItem";

export const MultisigPendingAccordion: React.FC<{
  account: MultisigAccount;
}> = ({ account }) => {
  const getPendingOperations = useGetPendingMultisigOperations();
  const pendingOperations = getPendingOperations(account);
  if (pendingOperations.length === 0) {
    return <NoItems small title="No multisig pending operations" />;
  }
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

export default MultisigPendingAccordion;
