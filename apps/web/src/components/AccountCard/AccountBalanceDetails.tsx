import { Box, Flex, Text } from "@chakra-ui/react";
import {
  useCurrentAccount,
  useGetAccountBalanceDetails,
  useGetAccountDelegate,
} from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { BigNumber } from "bignumber.js";

import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill";

const RoundStatusDot = ({ background }: { background: string }) => (
  <Box
    display="inline-block"
    width="8px"
    height="8px"
    marginRight="5px"
    background={background}
    borderRadius="100%"
  />
);

export const AccountBalanceDetails = () => {
  const color = useColor();
  const currentAccount = useCurrentAccount()!;
  const address = currentAccount.address.pkh;
  const {
    spendableBalance,
    stakedBalance,
    totalFinalizableAmount,
    totalPendingAmount,
    totalBalance,
  } = useGetAccountBalanceDetails(address);
  const delegate = useGetAccountDelegate()(address);

  const BalanceLabel = ({ label }: { label: string }) => (
    <Text color={color("600")} fontWeight="600" size="sm">
      {label}
    </Text>
  );
  const BalanceRow = ({
    label,
    testid,
    value,
  }: {
    label: string;
    testid: string;
    value: BigNumber | string | number;
  }) => (
    <Flex alignItems="center" justifyContent="space-between" width="100%" data-testid={testid}>
      <BalanceLabel label={label} />
      <Text color={color("700")} fontWeight="600" size="sm">
        {prettyTezAmount(value)}
      </Text>
    </Flex>
  );

  return (
    <Box data-testid="balance-details" paddingX="12px">
      <Flex flexDirection="column" gap="4px">
        {!delegate && !spendableBalance.isEqualTo(totalBalance) && (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            data-testid="delegation"
          >
            <BalanceLabel label="Delegation:" />
            <Flex alignItems="center" justifyContent="flex-end" gap="2">
              <RoundStatusDot background={color("orange")} />
              <Text size="sm">Inactive</Text>
            </Flex>
          </Flex>
        )}
        {delegate && (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            data-testid="delagated-to"
          >
            <BalanceLabel label="Delegated to:" />
            <AddressPill address={delegate} data-testid="current-baker" />
          </Flex>
        )}
        {!spendableBalance.isEqualTo(totalBalance) && (
          <BalanceRow label="Spendable:" testid="spendable-balance" value={spendableBalance} />
        )}
        {stakedBalance > 0 && (
          <BalanceRow label="Staked:" testid="staked-balance" value={stakedBalance} />
        )}
        {totalPendingAmount > BigNumber(0) && (
          <BalanceRow
            label="Frozen unstaked:"
            testid="frozen-unstaked-balance"
            value={totalPendingAmount}
          />
        )}
        {totalFinalizableAmount > BigNumber(0) && (
          <BalanceRow
            label="Finalizable unstaked:"
            testid="finalizable-unstaked-balance"
            value={totalFinalizableAmount}
          />
        )}
      </Flex>
    </Box>
  );
};
