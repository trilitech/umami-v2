import { Box, Flex, Text, Heading, Icon, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import colors from "../../../style/colors";
import { MultisigOperation, WalletAccountPkh } from "../../../utils/multisig/types";
import { MultisigAccount } from "../../../types/Account";
import MultisigSignerTile from "./MultisigSignerTile";

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

export const MultisigPendingCard: React.FC<{
  operation: MultisigOperation;
  signers: WalletAccountPkh[];
  threshold: number;
}> = ({ operation, signers, threshold }) => {
  const { isOpen, getDisclosureProps, getButtonProps } = useDisclosure({
    defaultIsOpen: true,
  });

  const pendingApprovals = Math.max(threshold - operation.approvals.length, 0);
  return (
    <Box bg={colors.gray[600]} p={3} borderRadius={6} marginY={5}>
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
          {/*TODO:  decode it */}
          <Box>{"operation.rawActions"}</Box>
          <Flex alignItems="center">
            <Heading color={colors.gray[400]} size="sm" mr={1}>
              Pending Approvals:
            </Heading>
            <Text color="w" data-testid="multisig-card-text">
              {pendingApprovals}
            </Text>
          </Flex>
        </Flex>

        <Box marginY={5}>
          {signers.map(signer => (
            <MultisigSignerTile
              key={signer}
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

export default MultisigPendingList;
