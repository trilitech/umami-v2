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
import MultisigSignerTile from "./MultisigSignerTile";
import MultisigDecodedOperations from "./MultisigDecodedOperations";
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
      bg={colors.gray[800]}
      p={3}
      borderRadius={6}
      marginY={3}
      pb={0}
      data-testid={"multisig-pending-operation-" + operation.id}
    >
      <AccordionItem border="none" borderRadius="8px">
        <h2>
          <AccordionButton flex="1" textAlign="left" pb={0} mb={0}>
            <Heading w="100%" size="sm">
              Pending #{operation.id}
            </Heading>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <Flex marginY={2} justifyContent="space-between" alignItems="end">
            <MultisigDecodedOperations rawActions={operation.rawActions} sender={sender} />
            <Flex alignItems="center" mb="6">
              <Heading color={colors.gray[400]} size="sm" mr={1}>
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
                signerAddress={signer}
                pendingApprovals={pendingApprovals}
                sender={sender}
                operation={operation}
              />
            ))}
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Box>
  );
};

export default MultisigPendingAccordionItem;
