import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type Toast, ToastProvider } from "@umami/utils";
import { Slot } from "expo-router";
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { TamaguiProvider } from "tamagui";

import store, { persistor } from "../store/store";
import { tamaguiConfig } from "../tamagui.config";

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider toast={{} as Toast}>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
          <Provider store={store}>
            <PersistGate
              loading={
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <ActivityIndicator color="#000" size="large" />
                </View>
              }
              persistor={persistor}
            >
              <Slot />
            </PersistGate>
          </Provider>
        </TamaguiProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
