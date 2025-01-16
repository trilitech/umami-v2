import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { useColorScheme } from 'react-native'
import { PersistGate } from "redux-persist/integration/react";
import { TamaguiProvider } from 'tamagui'

import { tamaguiConfig } from '../tamagui.config'

import store, { persistor } from "../store/store";

export default function RootLayout() {
  const colorScheme = useColorScheme()
  return (
    // <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack screenOptions={{ headerShown: false }} />
       </PersistGate>
     </Provider>
    // </TamaguiProvider>
  );
}
