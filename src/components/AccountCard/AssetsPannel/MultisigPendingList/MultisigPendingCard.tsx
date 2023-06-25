import { Box, Flex, Text, Heading, Icon, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import colors from "../../../../style/colors";
import { MultisigOperation } from "../../../../utils/multisig/types";
import MultisigSignerTile from "./MultisigSignerTile";
import { ImplicitAddress } from "../../../../types/Address";
import MultisigOperationsDisplay from "./MultisigDecodedOperations";

export const MultisigPendingCard: React.FC<{
  operation: MultisigOperation;
  signers: ImplicitAddress[];
  threshold: number;
}> = ({ operation, signers, threshold }) => {
  const { isOpen, getDisclosureProps, getButtonProps } = useDisclosure({
    defaultIsOpen: true,
  });
  const pendingApprovals = Math.max(threshold - operation.approvals.length, 0);
  return (
    <Box bg={colors.gray[800]} p={3} borderRadius={6} marginY={3}>
      <Flex justifyContent="space-between">
        <Heading size="sm">Pending #{operation.key}</Heading>
        <Icon
          {...getButtonProps()}
          as={isOpen ? IoIosArrowUp : IoIosArrowDown}
          cursor="pointer"
          _hover={{
            color: colors.gray[600],
          }}
        />
      </Flex>
      <Box p={1} {...getDisclosureProps()}>
        <Flex marginY={2} justifyContent="space-between">
          <MultisigOperationsDisplay rawActions={operation.rawActions} />
          <Flex alignItems="flex-end" mb="25px">
            <Text color={colors.gray[400]} size="sm" mr={1}>
              Pending Approvals:
            </Text>
            <Text color="w" data-testid="multisig-card-text">
              {pendingApprovals}
            </Text>
          </Flex>
        </Flex>

        <Box mb={5}>
          {signers.map(signer => (
            <MultisigSignerTile
              key={signer.pkh}
              signer={signer}
              approvers={operation.approvals}
              pendingApprovals={pendingApprovals}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MultisigPendingCard;
