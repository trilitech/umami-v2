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

import { useSocialOnboarding } from "../../services/auth";

export default function Home() {
  useDataPolling();

  const currentAccount = useCurrentAccount();
  const network = useSelectedNetwork();
  const selectNetwork = useSelectNetwork();
  const { logout } = useSocialOnboarding();

  const address = currentAccount ? currentAccount.address.pkh : "";

  const balance = useGetAccountBalance()(address);
  const balanceInUsd = useGetDollarBalance()(address);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 12 }}>Balance</Text>
      <Text style={{ marginTop: 5, fontWeight: "bold", fontSize: 18 }}>{balance ?? "$0.00"}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          marginVertical: 20,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              backgroundColor: "#E1E1EF",
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
          <Text>Buy</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              backgroundColor: "#E1E1EF",
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
          <Text>Swap</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              backgroundColor: "#E1E1EF",
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
          <Text>Receive</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              backgroundColor: "#E1E1EF",
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
          <Text>Send</Text>
        </View>
      </View>
      <View style={{ marginTop: 50 }}>
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
      </View>
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
    paddingTop: 20,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
