import { type Toast, ToastProvider } from "@umami/utils";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { TamaguiProvider } from "tamagui";

import store, { persistor } from "../store/store";
import { tamaguiConfig } from "../tamagui.config";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ToastProvider toast={{} as Toast}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Stack screenOptions={{ headerShown: false }} />
          </PersistGate>
        </Provider>
      </TamaguiProvider>
    </ToastProvider>
  );
}
