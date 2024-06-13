import { Box } from "@chakra-ui/react";
import type React from "react";

import { MultisigPendingOperation } from "./MultisigPendingOperation";
import { type MultisigAccount } from "../../../../types/Account";
import { useGetPendingMultisigOperations } from "../../../../utils/hooks/multisigHooks";

export const MultisigPendingOperations: React.FC<{
  account: MultisigAccount;
}> = ({ account }) => {
  const getPendingOperations = useGetPendingMultisigOperations();
  const pendingOperations = getPendingOperations(account);

  return (
    <Box margin="0" padding="0">
      {pendingOperations.map(operation => (
        <MultisigPendingOperation key={operation.id} operation={operation} sender={account} />
      ))}
    </Box>
  );
};
