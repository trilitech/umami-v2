import { Stack } from "expo-router";
import { View } from "react-native";

import { Header } from "../../components/Header";

export default function AuthenticatedLayout() {
  return (
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: "white", paddingHorizontal: 10 }}>
      <Header />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
      </Stack>
    </View>
  );
}
