import { Stack } from "expo-router";
import { TamaguiProvider, createTamagui } from "@tamagui/core";
import { isWeb } from '@tamagui/constants';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../store/store";
import { config } from '@tamagui/config/v3'

console.log('isWeb:', isWeb);


export default function RootLayout() {
  const tamaguiConfig = createTamagui(config);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TamaguiProvider config={tamaguiConfig}>
        <Stack screenOptions={{ headerShown: false }} />
        </TamaguiProvider>
      </PersistGate>
    </Provider>
  );
}
