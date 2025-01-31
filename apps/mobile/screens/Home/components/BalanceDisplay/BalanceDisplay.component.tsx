import type React from "react";
import { Text, YStack } from "tamagui";

interface BalanceDisplayProps {
  balance?: number
}

export const BalanceDisplayComponent: React.FC<BalanceDisplayProps> = ({ balance }) => (
  <YStack alignItems="center">
    <Text fontSize={12}>Balance</Text>
    <Text marginTop={5} fontSize={18} fontWeight="bold">
      {balance ?? "$0.00"}
    </Text>
  </YStack>
);
