import { type SocialAccount } from "@umami/core";
import { useCurrentAccount, useGetAccountBalance } from "@umami/state";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "tamagui";

import { useSocialOnboarding } from "../services/auth/useSocialOnboarding";

export default function HomeScreen() {
  const currentAccount = useCurrentAccount();
  const getBalance = useGetAccountBalance();
  const { logout } = useSocialOnboarding();
  const balance = getBalance(currentAccount ? currentAccount.address.pkh : "");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <Text>{currentAccount?.address.pkh}</Text>
      <Text>{currentAccount?.label}</Text>
      <Text>Balance: {balance}</Text>
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
