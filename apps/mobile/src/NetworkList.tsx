import { Text, Stack } from "tamagui";
import { useAvailableNetworks } from "@umami/state";

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
