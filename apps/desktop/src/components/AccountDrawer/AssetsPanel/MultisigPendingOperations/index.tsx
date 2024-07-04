import { Box } from "@chakra-ui/react";
import { type MultisigAccount } from "@umami/core";
import { useGetPendingMultisigOperations } from "@umami/state";

import { MultisigPendingOperation } from "./MultisigPendingOperation";

export const MultisigPendingOperations = ({ account }: { account: MultisigAccount }) => {
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
