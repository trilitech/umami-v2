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

const MultisigSignerTile: React.FC<{
  signer: WalletAccountPkh;
  signerHasApproved: boolean;
  waitingForApprovals: boolean;
}> = ({ signer, signerHasApproved, waitingForApprovals }) => {
  const getContactName = useGetContractName();
  const getImplicitAccount = useGetImplicitAccount();
  const accountLabel = getImplicitAccount(signer)?.label;
  const label = accountLabel || getContactName(signer);

  const signerCanSubmitTx =
    accountLabel !== undefined && !(signerHasApproved && waitingForApprovals);

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
          {signerCanSubmitTx ? (
            <Button colorScheme="gray" data-testid="multisig-signer-button">
              {waitingForApprovals ? "Approve" : "Execute"}
            </Button>
          ) : (
            <IconAndTextBtn
              icon={signerHasApproved ? RxCheckCircled : CgSandClock}
              iconColor={signerHasApproved ? colors.greenL : colors.orange}
              iconHeight={5}
              iconWidth={5}
              label={signerHasApproved ? "Approved" : "Awaiting Approval"}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default MultisigSignerTile;
