import { Slot } from "expo-router";
import { View } from "react-native";

import { HeaderComponent } from "../../components/header";

export default function AuthenticatedLayout() {
  return (
    <View style={{ flex: 1, paddingTop: 60, backgroundColor: "white", paddingHorizontal: 10 }}>
      <HeaderComponent />
      <Slot />
    </View>
  );
}
