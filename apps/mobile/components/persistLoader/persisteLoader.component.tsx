import { ActivityIndicator } from "react-native"
import { YStack } from "tamagui"

export const PersistedLoaderComponent: React.FC = () => {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <ActivityIndicator color="#000" size="large" />
    </YStack>
  )
}
