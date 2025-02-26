import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import {
  useCurrentAccount,
  useGetAccountBalanceDetails,
  useGetAccountDelegate,
} from "@umami/state";
import { formatTezAmountMin0Decimals } from "@umami/tezos";
import { BigNumber } from "bignumber.js";

import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill";

const RoundStatusDot = ({ background }: { background: string }) => (
  <Box
    gap="4px"
    display="inline-block"
    width="11px"
    height="11px"
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
    <Flex
      alignItems="center"
      justifyContent="space-between"
      gap="12px"
      width="100%"
      data-testid={testid}
    >
      <BalanceLabel label={label} />
      <Text color={color("700")} fontWeight="600" size="sm">
        {formatTezAmountMin0Decimals(value)}
      </Text>
    </Flex>
  );

  return !delegate && spendableBalance.isEqualTo(totalBalance) ? null : (
    <Flex
      flexDirection="column"
      gap="12px"
      padding="12px"
      background={color("50")}
      borderRadius="20px"
      data-testid="balance-details"
      paddingX="12px"
    >
      {!delegate && !spendableBalance.isEqualTo(totalBalance) && (
        <Flex alignItems="left" data-testid="delegation-ended">
          <Flex
            alignItems="center"
            justifyContent="flex-end"
            gap="2"
            background="rgba(197, 48, 48, 0.15)"
            borderRadius="100px"
            paddingX="3"
          >
            <RoundStatusDot background={color("red")} />
            <Text color={color("red")} size="sm">
              Delegation ended
            </Text>
          </Flex>
        </Flex>
      )}
      {delegate && (
        <Flex alignItems="center" justifyContent="left" gap="6px" data-testid="delagated-to">
          <Flex
            alignItems="center"
            justifyContent="flex-start"
            flex="0 0 107px"
            gap="2px"
            overflow="hidden"
            background={color("greenLight")}
            borderRadius="100px"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            paddingX="7px"
            paddingY="3px"
          >
            <RoundStatusDot background={color("greenDark")} />
            <Text color={color("green")} fontWeight="600" size="sm">
              Delegation
            </Text>
          </Flex>
          <Text
            alignItems="center"
            overflow="hidden"
            width="30px"
            data-testid="delegation-to"
            paddingY="3px"
            size="sm"
          >
            To:
          </Text>
          <AddressPill
            overflow="hidden"
            maxWidth="45vw"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            address={delegate}
            data-testid="current-baker"
          />
        </Flex>
      )}
      {!spendableBalance.isEqualTo(totalBalance) && <Divider />}
      {stakedBalance > 0 && (
        <BalanceRow label="Staked" testid="staked-balance" value={stakedBalance} />
      )}
      {totalPendingAmount > BigNumber(0) && (
        <BalanceRow
          label="Frozen unstaked"
          testid="frozen-unstaked-balance"
          value={totalPendingAmount}
        />
      )}
      {totalFinalizableAmount > BigNumber(0) && (
        <BalanceRow
          label="Finalizable"
          testid="finalizable-balance"
          value={totalFinalizableAmount}
        />
      )}
      {!totalBalance.isEqualTo(spendableBalance) && (
        <BalanceRow label="Total" testid="total-balance" value={totalBalance} />
      )}
    </Flex>
  );
};
