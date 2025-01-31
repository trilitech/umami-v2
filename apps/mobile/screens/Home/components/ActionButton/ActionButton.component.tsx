import type React from "react";
import { Text, View, YStack } from "tamagui";

interface ActionButtonComponentProps {
  title: string
}

export const ActionButtonComponent: React.FC<ActionButtonComponentProps> = ({ title }) => (
  <YStack alignItems="center">
    <View
      alignItems="center"
      justifyContent="center"
      width={40}
      height={40}
      borderRadius={20}
      backgroundColor="#E1E1EF"
    />
    <Text>{title}</Text>
  </YStack>
);
