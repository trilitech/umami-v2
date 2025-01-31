import { type Toast, ToastProvider } from "@umami/utils";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { TamaguiProvider } from "tamagui";

import { PersistedLoaderComponent } from "../components/persistLoader/persisteLoader.component";
import { AuthProvider, ReactQueryProvider } from "../providers";
import store, { persistor } from "../store/store";
import { tamaguiConfig } from "../tamagui.config";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <ToastProvider toast={{} as Toast}>
      <ReactQueryProvider>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
          <Provider store={store}>
            <PersistGate
              loading={<PersistedLoaderComponent />}
              persistor={persistor}
            >
              <AuthProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="login" />
                  <Stack.Screen name="authenticated" />
                </Stack>
              </AuthProvider>
            </PersistGate>
          </Provider>
        </TamaguiProvider>
      </ReactQueryProvider>
    </ToastProvider>
  );
}
