import { useAvailableNetworks } from "@umami/state";
import { Stack, Text } from "tamagui";

export const NetworkList = () => {
  const networks = useAvailableNetworks();

  return (
    <Stack padding="10">
      <Text>Network List:</Text>
      {networks.map(network => (
        <Text key={network.name}>{network.name}</Text>
      ))}
    </Stack>
  );
};
