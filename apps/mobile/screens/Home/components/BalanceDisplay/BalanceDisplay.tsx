import { useGetAccountBalance, useGetDollarBalance } from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import type React from "react";
import { Text, YStack } from "tamagui";

interface BalanceDisplayProps {
  address: string;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ address }) => {
  const balance = prettyTezAmount(useGetAccountBalance()(address) ?? 0);
  const balanceInUsd = useGetDollarBalance()(address);

  return (
    <YStack alignItems="center">
      <Text fontSize={12}>Balance</Text>
      <Text marginTop={5} fontSize={18} fontWeight="bold">
        {balance}
      </Text>
      <Text fontSize={12}>${balanceInUsd?.toString() ?? "0.00"}</Text>
    </YStack>
  );
};
