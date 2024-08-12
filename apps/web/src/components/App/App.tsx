import { useCurrentAccount } from "@umami/state";

import { Layout } from "../../Layout";
import { Welcome } from "../../views/Welcome";
import { BeaconProvider } from "../beacon";

export const App = () => {
  const currentAccount = useCurrentAccount();

  return currentAccount ? (
    <BeaconProvider>
      <Layout />
    </BeaconProvider>
  ) : (
    <Welcome />
  );
};
