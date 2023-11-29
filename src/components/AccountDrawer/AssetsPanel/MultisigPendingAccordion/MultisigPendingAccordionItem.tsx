import {
  Box,
  Flex,
  Text,
  Heading,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import React from "react";
import { MultisigOperation } from "../../../../utils/multisig/types";
import { MultisigSignerTile } from "./MultisigSignerTile";
import { MultisigDecodedOperations } from "./MultisigDecodedOperations";
import { MultisigAccount } from "../../../../types/Account";
import colors from "../../../../style/colors";

export const MultisigPendingAccordionItem: React.FC<{
  operation: MultisigOperation;
  sender: MultisigAccount;
}> = ({ operation, sender }) => {
  const { signers, threshold } = sender;
  const pendingApprovals = Math.max(threshold - operation.approvals.length, 0);
  return (
    <Box
      padding={3}
      paddingBottom={0}
      background={colors.gray[800]}
      borderRadius={6}
      data-testid={"multisig-pending-operation-" + operation.id}
      marginY={3}
    >
      <AccordionItem border="none" borderRadius="8px">
        <h2>
          <AccordionButton flex="1" marginBottom={0} paddingBottom={0} textAlign="left">
            <Heading width="100%" size="sm">
              Pending #{operation.id}
            </Heading>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <Flex alignItems="end" justifyContent="space-between" marginY={2}>
            <MultisigDecodedOperations rawActions={operation.rawActions} sender={sender} />
            <Flex alignItems="center" marginBottom="6">
              <Heading marginRight={1} color={colors.gray[400]} size="sm">
                Pending Approvals:
              </Heading>
              <Text color="w" data-testid="pending-approvals-count">
                {pendingApprovals}
              </Text>
            </Flex>
          </Flex>

          <Box marginY={5}>
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
        </AccordionPanel>
      </AccordionItem>
    </Box>
  );
};
