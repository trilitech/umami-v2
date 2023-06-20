import { Box } from "@chakra-ui/react";
import React from "react";
import { MultisigAccount } from "../../../../types/Account";
import MultisigPendingCard from "./MultisigPendingCard";

export const MultisigPendingList: React.FC<{
  account: MultisigAccount;
}> = ({ account }) => {
  return (
    <Box w="100%">
      {account.operations.map(operation => (
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
