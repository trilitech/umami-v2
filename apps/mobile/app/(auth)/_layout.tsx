import { useCurrentAccount } from "@umami/state";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

import { Header } from "../../components/Header";

export default function AuthenticatedLayout() {
  const currentAccount = useCurrentAccount();

  if (!currentAccount) {
    return <Redirect href="/" />;
  }

  return (
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: "white", paddingHorizontal: 10 }}>
      <Header />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      </Stack>
    </View>
  );
}
