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

// Set environment variable to disable theme warning
process.env.TAMAGUI_DISABLE_NO_THEME_WARNING = '1';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      {/* <PersistGate loading={<PersistorLoader />} persistor={persistor}> */}
        <ToastProvider toast={{} as Toast}>
          <ReactQueryProvider>
            <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme || 'light'}>
              <ModalProvider>
                <AuthProvider>
                  <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                  </Stack>
                </AuthProvider>
              </ModalProvider>
            </TamaguiProvider>
          </ReactQueryProvider>
        </ToastProvider>
      {/* </PersistGate> */}
    </Provider>
  );
}
