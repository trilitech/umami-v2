import type React from "react";
import { Text, YStack } from "tamagui";

interface BalanceDisplayProps {
  balance?: string;
  balanceInUsd?: string;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, balanceInUsd }) => (
  <YStack alignItems="center">
    <Text fontSize={12}>Balance</Text>
    <Text marginTop={5} fontSize={18} fontWeight="bold">
      {balance}
    </Text>
    <Text fontSize={12}>${balanceInUsd ?? "0.00"}</Text>
  </YStack>
);
