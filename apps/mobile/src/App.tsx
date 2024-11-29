import { config } from "@tamagui/config/v3";
import { TamaguiProvider, createTamagui } from "@tamagui/core";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { NetworkList } from "./NetworkList";
import { persistor } from "./persistor";
import { store } from "./store";
import { ImportOldAccounts } from "./ImportOldAccounts";
import * as umamiCrypto from "@umami/crypto";
// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui({});

// // TypeScript types across all Tamagui APIs
// type Conf = typeof tamaguiConfig;
// declare module "@tamagui/core" {
//   interface TamaguiCustomConfig extends Conf {}
// }

// it's replaced in metro.config.js with @umami/crypto-react-native
// the output is:
// {"decrypt": [Function decrypt], "decryptV1": [Function decryptV1], "deriveKey": [Function deriveKey], "encrypt": [Function encrypt]}
console.log(umamiCrypto);

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <TamaguiProvider config={tamaguiConfig}>
        <ImportOldAccounts />
        <NetworkList />
      </TamaguiProvider>
    </PersistGate>
  </Provider>
);
