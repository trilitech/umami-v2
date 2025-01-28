import { type SocialAccount } from "@umami/core";
import { useDataPolling } from "@umami/data-polling";
import {
  useCurrentAccount,
  useGetAccountBalance,
  useGetDollarBalance,
  useSelectNetwork,
  useSelectedNetwork,
} from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { StyleSheet, Text, View } from "react-native";
import { Button, Label, Switch, XStack } from "tamagui";

import { useSocialOnboarding } from "../services/auth/useSocialOnboarding";

export default function HomeScreen() {
  useDataPolling();

  const currentAccount = useCurrentAccount();
  const network = useSelectedNetwork();
  const selectNetwork = useSelectNetwork();
  const { logout } = useSocialOnboarding();
  const balance = useGetAccountBalance()(currentAccount ? currentAccount.address.pkh : "");
  const balanceInUsd = useGetDollarBalance()(currentAccount ? currentAccount.address.pkh : "");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <XStack alignItems="center" gap={8}>
        <Label htmlFor="network-switch">Current network</Label>
        <Switch
          checked={network.name === "mainnet"}
          id="network-switch"
          onCheckedChange={checked => {
            selectNetwork(checked ? "mainnet" : "ghostnet");
          }}
          size="$4"
        >
          <Switch.Thumb animation="quick" />
        </Switch>
      </XStack>
      <Text>Current network: {network.name}</Text>
      <Text>Label: {currentAccount?.label}</Text>
      <Text>Address: {currentAccount?.address.pkh}</Text>
      <Text>Balance: {prettyTezAmount(balance ?? 0)}</Text>
      <Text>Balance in USD: {balanceInUsd?.toString() ?? 0}</Text>
      <Button onPress={() => logout((currentAccount as SocialAccount).idp)}>
        <Button.Text>Logout</Button.Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
