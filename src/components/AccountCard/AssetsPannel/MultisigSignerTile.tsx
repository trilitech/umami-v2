import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import React from "react";
import colors from "../../../style/colors";
import { formatPkh } from "../../../utils/format";
import { useGetImplicitAccount } from "../../../utils/hooks/accountHooks";
import { useGetContractName } from "../../../utils/hooks/contactsHooks";
import { WalletAccountPkh } from "../../../utils/multisig/types";
import { Identicon } from "../../Identicon";
import MultisigActionButton from "./MultisigActionButton";

const MultisigSignerTile: React.FC<{
  signer: WalletAccountPkh;
  approvers: WalletAccountPkh[];
  pendingApprovals: number;
}> = ({ signer, approvers, pendingApprovals }) => {
  const getContactName = useGetContractName();
  const getImplicitAccount = useGetImplicitAccount();
  const accountLabel = getImplicitAccount(signer)?.label;
  const label = accountLabel || getContactName(signer);

  return (
    <Flex
      mb={4}
      p={4}
      bg={colors.gray[900]}
      h="78px"
      borderRadius={8}
      border={`1px solid ${colors.gray[800]}`}
      alignItems="center"
    >
      <Identicon address={signer} />
      <Flex flex={1} justifyContent="space-between" alignItems="center">
        <Box m={4}>
          {label && <Heading size="md">{label}</Heading>}
          <Flex alignItems="center">
            <Text size="sm" color="text.dark">
              {formatPkh(signer)}
            </Text>
          </Flex>
        </Box>
        <Box>
          <MultisigActionButton
            signer={signer}
            approvers={approvers}
            pendingApprovals={pendingApprovals}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default MultisigSignerTile;
