import { Box, Flex, Text } from "@chakra-ui/react";
import { useCurrentAccount, useGetAccountBalanceDetails, useMutezToUsd } from "@umami/state";
import { formatUsdAmount, prettyTezAmount } from "@umami/tezos";
import { BigNumber } from "bignumber.js";

import { useColor } from "../../styles/useColor";

export const AccountBalance = () => {
  const color = useColor();
  const currentAccount = useCurrentAccount()!;
  const address = currentAccount.address.pkh;
  const mutezToDollar = useMutezToUsd();
  const { spendableBalance } = useGetAccountBalanceDetails(address);

  const BalanceLabel = ({ label }: { label: string }) => (
    <Text color={color("600")} fontWeight="600" size="sm">
      {label}
    </Text>
  );

  const getUsdBalance = (tezosBalance?: string) => {
    if (tezosBalance === undefined || BigNumber(tezosBalance).isEqualTo(0)) {
      return "$0.00";
    }
    const usdBalance = mutezToDollar(tezosBalance);
    if (usdBalance === undefined) {
      return undefined;
    }

    return formatUsdAmount(usdBalance);
  };

  const totalUsdBalance = getUsdBalance(spendableBalance.toString());

  return (
    <Box data-testid="account-balance" paddingX="12px">
      <Flex flexDirection="column" gap="4px">
        <BalanceLabel label="Spendable" />
        <Text color={color("900")} fontWeight="600" data-testid="tez-balance" size="2xl">
          {prettyTezAmount(spendableBalance)}
        </Text>
        {totalUsdBalance && (
          <Text color={color("700")} data-testid="usd-balance" size="sm">
            {totalUsdBalance}
          </Text>
        )}
      </Flex>
    </Box>
  );
};
