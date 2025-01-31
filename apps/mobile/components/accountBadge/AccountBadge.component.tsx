import type React from "react"
import { Text, View, XStack } from "tamagui";

export const AccountBadge: React.FC = () => (
  <XStack
    alignItems="center"
    justifyContent="center"
    borderRadius={100}
    backgroundColor="#E1E1EF"
    paddingHorizontal={10}
    paddingVertical={6}
  >
    <View
      width={24}
      height={24}
      marginRight={5}
      borderRadius={12}
      backgroundColor="white"
    />
    <Text>Account</Text>
  </XStack>
);
