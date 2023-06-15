import { Box, Flex, Text, Heading, Button } from "@chakra-ui/react";
import React from "react";
import { CgSandClock } from "react-icons/cg";
import { RxCheckCircled } from "react-icons/rx";
import colors from "../../../style/colors";
import { formatPkh } from "../../../utils/format";
import { useGetImplicitAccount } from "../../../utils/hooks/accountHooks";
import { useGetContractName } from "../../../utils/hooks/contactsHooks";
import { WalletAccountPkh } from "../../../utils/multisig/types";
import { IconAndTextBtn } from "../../IconAndTextBtn";
import { Identicon } from "../../Identicon";

type Props = {
  signer: WalletAccountPkh;
  approvers: WalletAccountPkh[];
  pendingApprovals: number;
};

export const ActionButton: React.FC<Props> = ({ signer, approvers, pendingApprovals }) => {
  const getImplicitAccount = useGetImplicitAccount();

  const signerInOwnedAccounts = getImplicitAccount(signer) !== undefined;
  const approvedBySigner = approvers.find(approver => approver === signer) !== undefined;
  const operationIsExecutable = pendingApprovals === 0;

  if (!signerInOwnedAccounts) {
    return (
      <IconAndTextBtn
        data-testid="multisig-signer-approved-or-waiting"
        icon={approvedBySigner ? RxCheckCircled : CgSandClock}
        iconColor={approvedBySigner ? colors.greenL : colors.orange}
        iconHeight={5}
        iconWidth={5}
        label={approvedBySigner ? "Approved" : "Awaiting Approval"}
      />
    );
  } else if (approvedBySigner && !operationIsExecutable) {
    return (
      <IconAndTextBtn
        data-testid="multisig-signer-approved"
        icon={RxCheckCircled}
        iconColor={colors.greenL}
        iconHeight={5}
        iconWidth={5}
        label={"Approved"}
      />
    );
  }

  return (
    <Button colorScheme="gray" data-testid="multisig-signer-button">
      {operationIsExecutable ? "Execute" : "Approve"}
    </Button>
  );
};

const MultisigSignerTile: React.FC<Props> = ({ signer, approvers, pendingApprovals }) => {
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
          {label && <Heading size={"md"}>{label}</Heading>}
          <Flex alignItems={"center"}>
            <Text size={"sm"} color="text.dark">
              {formatPkh(signer)}
            </Text>
          </Flex>
        </Box>
        <Box>
          <ActionButton signer={signer} approvers={approvers} pendingApprovals={pendingApprovals} />
        </Box>
      </Flex>
    </Flex>
  );
};

export default MultisigSignerTile;
