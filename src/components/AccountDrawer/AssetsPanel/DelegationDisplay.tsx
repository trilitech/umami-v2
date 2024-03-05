import { Box, Button, Flex, FlexProps, Heading, Text } from "@chakra-ui/react";
import React, { ReactNode, useContext } from "react";

import colors from "../../../style/colors";
import { Account } from "../../../types/Account";
import { parsePkh } from "../../../types/Address";
import { Delegation } from "../../../types/Delegation";
import { useGetDelegationPrettyDisplayValues } from "../../../utils/hooks/delegationHooks";
import { useGetOwnedAccount } from "../../../utils/hooks/getAccountDataHooks";
import { AddressPill } from "../../AddressPill/AddressPill";
import { DynamicModalContext } from "../../DynamicModal";
import { NoDelegations } from "../../NoItems";
import { FormPage as DelegationFormPage } from "../../SendFlow/Delegation/FormPage";
import { FormPage as UndelegationFormPage } from "../../SendFlow/Undelegation/FormPage";

const Row: React.FC<
  {
    label: string;
    value: string | ReactNode;
  } & FlexProps
> = ({ label, value, ...props }) => (
  <Flex alignItems="center" height="50px" padding="16px" data-testid={label} {...props}>
    <Box flex={1}>
      <Heading color={colors.gray[400]} size="sm">
        {label}
      </Heading>
    </Box>
    <Box flex={1}>{typeof value === "string" ? <Text size="sm">{value}</Text> : value}</Box>
  </Flex>
);

export const DelegationDisplay: React.FC<{
  account: Account;
  delegation: Delegation | null;
}> = ({ delegation, account }) => {
  const { openWith } = useContext(DynamicModalContext);
  const getOwnedAccount = useGetOwnedAccount();
  const getDelegationPrettyDisplay = useGetDelegationPrettyDisplayValues();
  if (!delegation) {
    return (
      <NoDelegations
        onDelegate={() => openWith(<DelegationFormPage sender={account} />)}
        size="md"
      />
    );
  }

  const { currentBalance, duration, initialBalance } = getDelegationPrettyDisplay(delegation);
  const {
    sender,
    delegate: { address: baker },
  } = delegation;
  const senderAccount = getOwnedAccount(sender);

  return (
    <Box>
      <Row
        borderBottom={`1px solid ${colors.gray[700]}`}
        borderTopRadius="8px"
        _odd={{ bg: colors.gray[800] }}
        label="Initial Balance:"
        value={initialBalance}
      />
      {currentBalance && (
        <Row _odd={{ bg: colors.gray[800] }} label="Current Balance:" value={currentBalance} />
      )}
      <Row
        borderBottom={`1px solid ${colors.gray[700]}`}
        _odd={{ bg: colors.gray[800] }}
        label="Duration:"
        value={duration}
      />
      <Row
        borderBottomRadius="8px"
        _odd={{ bg: colors.gray[800] }}
        label="Baker:"
        value={<AddressPill address={parsePkh(delegation.delegate.address)} />}
      />

      <Flex marginTop="24px">
        <Button
          flex={1}
          marginRight="16px"
          onClick={() =>
            openWith(<UndelegationFormPage form={{ sender, baker }} sender={senderAccount} />)
          }
          variant="warning"
        >
          End Delegation
        </Button>
        <Button
          flex={1}
          onClick={() =>
            openWith(<DelegationFormPage form={{ sender, baker }} sender={senderAccount} />)
          }
          variant="tertiary"
        >
          Change Baker
        </Button>
      </Flex>
    </Box>
  );
};
