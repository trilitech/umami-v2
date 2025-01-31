import type React from "react";
import { Label, Switch, XStack } from "tamagui";

interface NetworkSwitchProps {
  network: { name: string };
  selectNetwork: (network: string) => void;
}

export const NetworkSwitchComponent: React.FC<NetworkSwitchProps> = ({
   network,
   selectNetwork,
 }) => (
  <XStack alignItems="center" gap={8}>
    <Label htmlFor="network-switch">Current network</Label>
    <Switch
      checked={network.name === "mainnet"}
      id="network-switch"
      onCheckedChange={(checked) => selectNetwork(checked ? "mainnet" : "ghostnet")}
      size="$4"
    >
      <Switch.Thumb animation="quick" />
    </Switch>
  </XStack>
);
