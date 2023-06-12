import { Box, Flex, Text, Heading, Icon, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import colors from "../../../style/colors";
import { MultisigAccount } from "../../../types/Account";
import { formatPkh } from "../../../utils/format";
import { useGetImplicitAccount } from "../../../utils/hooks/accountHooks";
import { useGetContractName } from "../../../utils/hooks/contactsHooks";
import { MultisigOperation, WalletAccountPkh } from "../../../utils/multisig/types";
import { Identicon } from "../../Identicon";

export const MultisigPendingList: React.FC<{
  account: MultisigAccount;
}> = ({ account }) => {
  return (
    <Box w="100%">
      {account.operations.map(operation => (
        <MultisigPendingCard
          operation={operation}
          signers={account.signers}
          threshold={account.threshold}
        />
      ))}
    </Box>
  );
};

const MultisigPendingCard: React.FC<{
  operation: MultisigOperation;
  signers: WalletAccountPkh[];
  threshold: number;
}> = ({ operation, signers, threshold }) => {
  const { isOpen, getDisclosureProps, getButtonProps } = useDisclosure({
    defaultIsOpen: true,
  });
  const pendingApprovals = threshold - operation.approvals.length;
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
            <Text color="w">{pendingApprovals}</Text>
          </Flex>
        </Flex>

        <Box marginY={5}>
          {signers.map(signer => {
            return <SignerTile signer={signer} approvers={new Set(operation.approvals)} />;
          })}
        </Box>
      </Box>
    </Box>
  );
};

const SignerTile: React.FC<{
  signer: WalletAccountPkh;
  approvers: Set<WalletAccountPkh>;
}> = ({ signer, approvers }) => {
  const getContactName = useGetContractName();
  const getImplicitAccount = useGetImplicitAccount();
  const label = getImplicitAccount(signer)?.label || getContactName(signer);

  return (
    <Flex
      mb={4}
      p={4}
      bg="umami.gray.900"
      h="78px"
      borderRadius={8}
      border={`1px solid ${colors.gray[800]}`}
      alignItems="center"
    >
      <Identicon address={signer} />
      <Flex flex={1} justifyContent="space-between" alignItems="center">
        <Box m={4}>
          {label && <Heading size={"md"}>{label}</Heading>}
          <Flex alignItems={"center"}>
            <Text size={"sm"} color="text.dark">
              {formatPkh(signer)}
            </Text>
          </Flex>
        </Box>
        {/* TODO: implment approve/execute */}
        <Box>button</Box>
      </Flex>
    </Flex>
  );
};

export default MultisigPendingList;
