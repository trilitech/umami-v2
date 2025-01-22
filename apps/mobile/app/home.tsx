import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCurrentAccount, useGetAccountBalance } from "@umami/state";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "tamagui";

import { persistor } from "../store/store";

export default function HomeScreen() {
  const currentAccount = useCurrentAccount();
  const getBalance = useGetAccountBalance();
  const balance = getBalance(currentAccount!.address.pkh);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen!</Text>
      <Text>{currentAccount?.address.pkh}</Text>
      <Text>{currentAccount?.label}</Text>
      <Text>Balance: {balance}</Text>
      <Button
        onPress={async () => {
          persistor.pause();
          await AsyncStorage.clear();
          await SecureStore.deleteItemAsync("authToken");
          router.replace("/onboarding");
        }}
      >
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
