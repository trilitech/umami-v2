import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import React from "react";
import colors from "../../../../style/colors";
import { MultisigAccount } from "../../../../types/Account";
import { ImplicitAddress } from "../../../../types/Address";
import { formatPkh } from "../../../../utils/format";
import { useGetImplicitAccountSafe } from "../../../../utils/hooks/accountHooks";
import { useGetContactName } from "../../../../utils/hooks/contactsHooks";
import { MultisigOperation } from "../../../../utils/multisig/types";
import { ParamsWithFee } from "../../../ApproveExecuteForm/types";
import { Identicon } from "../../../Identicon";
import MultisigActionButton from "./MultisigActionButton";

const MultisigSignerTile: React.FC<{
  signerAddress: ImplicitAddress;
  pendingApprovals: number;
  operation: MultisigOperation;
  sender: MultisigAccount;
  openSignModal: (params: ParamsWithFee) => void;
}> = props => {
  const signer = props.signerAddress;
  const getContactName = useGetContactName();
  const getImplicitAccount = useGetImplicitAccountSafe();
  const accountLabel = getImplicitAccount(signer.pkh)?.label;
  const label = accountLabel || getContactName(signer.pkh);

  return (
    <Flex
      mb={4}
      p={4}
      bg={colors.gray[700]}
      h="78px"
      borderRadius={8}
      border={`1px solid ${colors.gray[800]}`}
      alignItems="center"
    >
      <Identicon address={signer.pkh} />
      <Flex flex={1} justifyContent="space-between" alignItems="center">
        <Box m={4}>
          {label && <Heading size="md">{label}</Heading>}
          <Flex alignItems="center">
            <Text size="sm" color="text.dark">
              {formatPkh(signer.pkh)}
            </Text>
          </Flex>
        </Box>
        <Box>
          <MultisigActionButton {...props} />
        </Box>
      </Flex>
    </Flex>
  );
};

export default MultisigSignerTile;
