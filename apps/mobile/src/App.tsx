import { config } from "@tamagui/config/v3";
import { TamaguiProvider, createTamagui } from "@tamagui/core";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { NetworkList } from "./NetworkList";
import { persistor } from "./persistor";
import { store } from "./store";

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui(config);

// // TypeScript types across all Tamagui APIs
// type Conf = typeof tamaguiConfig;
// declare module "@tamagui/core" {
//   interface TamaguiCustomConfig extends Conf {}
// }

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <TamaguiProvider config={tamaguiConfig}>
        <NetworkList />
      </TamaguiProvider>
    </PersistGate>
  </Provider>
);
