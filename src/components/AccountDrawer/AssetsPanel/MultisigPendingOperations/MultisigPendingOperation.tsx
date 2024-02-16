import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

import { MultisigDecodedOperations } from "./MultisigDecodedOperations";
import { MultisigSignerTile } from "./MultisigSignerTile";
import colors from "../../../../style/colors";
import { MultisigAccount } from "../../../../types/Account";
import { MultisigOperation } from "../../../../utils/multisig/types";

export const MultisigPendingOperation: React.FC<{
  operation: MultisigOperation;
  sender: MultisigAccount;
}> = ({ operation, sender }) => {
  const { signers, threshold } = sender;
  const pendingApprovals = Math.max(threshold - operation.approvals.length, 0);
  return (
    <Box
      marginBottom="24px"
      background={colors.gray[800]}
      border="none"
      borderRadius="8px"
      data-testid={"multisig-pending-operation-" + operation.id}
      paddingX="16px"
      paddingY="15px"
    >
      <Flex justifyContent="space-between" marginBottom="6px" padding={0} textAlign="left">
        <Heading size="md">Pending #{operation.id}</Heading>
        <Flex alignItems="center" marginBottom="6px">
          <Heading marginRight="4px" color={colors.gray[450]} size="sm">
            Pending Approvals:
          </Heading>
          <Text color={colors.gray[400]} data-testid="pending-approvals-count">
            {pendingApprovals}
          </Text>
        </Flex>
      </Flex>
      <Box padding="0">
        <MultisigDecodedOperations rawMichelson={operation.rawActions} sender={sender} />

        {signers.map(signer => (
          <MultisigSignerTile
            key={signer.pkh}
            operation={operation}
            pendingApprovals={pendingApprovals}
            sender={sender}
            signerAddress={signer}
          />
        ))}
      </Box>
    </Box>
  );
};
