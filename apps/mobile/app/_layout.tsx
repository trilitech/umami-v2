import { type Toast, ToastProvider } from "@umami/utils";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { TamaguiProvider } from "tamagui";

import { PersistorLoader } from "../components/PersistorLoader";
import { AuthProvider, ReactQueryProvider } from "../providers";
import { ModalProvider } from "../providers/ModalProvider";
import { persistor, store } from "../store";
import { tamaguiConfig } from "../tamagui.config";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<PersistorLoader />} persistor={persistor}>
        <ToastProvider toast={{} as Toast}>
          <ReactQueryProvider>
            <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
              <ModalProvider>
                <AuthProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" options={{ gestureEnabled: false }} />
                    <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
                  </Stack>
                </AuthProvider>
              </ModalProvider>
            </TamaguiProvider>
          </ReactQueryProvider>
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
}
