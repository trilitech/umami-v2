import { TestComponent } from "@umami/mobile-components";
import { config } from "@tamagui/config/v3";
import { TamaguiProvider, createTamagui } from "@tamagui/core";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../store/store";

const tamaguiConfig = createTamagui(config);

export default function Index() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TamaguiProvider config={tamaguiConfig}>
          <TestComponent />
         </TamaguiProvider>
       </PersistGate>
     </Provider>
  );
}
