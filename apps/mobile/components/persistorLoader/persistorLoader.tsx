import { ActivityIndicator } from "react-native";
import { YStack } from "tamagui";

export const PersistorLoader = () => (
  <YStack alignItems="center" justifyContent="center" flex={1}>
    <ActivityIndicator color="#000" size="large" />
  </YStack>
);
