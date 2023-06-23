import { Box } from "@chakra-ui/react";
import React from "react";
import { MultisigAccount } from "../../../../types/Account";
import { useGetMultisigPendingOperations } from "../../../../utils/hooks/multisigHooks";
import MultisigPendingCard from "./MultisigPendingCard";

export const MultisigPendingList: React.FC<{
  account: MultisigAccount;
}> = ({ account }) => {
  const getMultisigPendingOps = useGetMultisigPendingOperations();
  const pendingOperations = getMultisigPendingOps(account.address);
  return (
    <Box w="100%">
      {pendingOperations.map(operation => (
        <MultisigPendingCard
          key={operation.key}
          operation={operation}
          signers={account.signers}
          threshold={account.threshold}
        />
      ))}
    </Box>
  );
};

export default MultisigPendingList;
