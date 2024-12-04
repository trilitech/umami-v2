import { useCurrentAccount } from "@umami/state";

import { Layout } from "../../Layout";
import { Welcome } from "../../views/Welcome";
import { BeaconProvider } from "../beacon";
import { WalletConnectProvider } from "../WalletConnect/WalletConnectProvider";

export const App = () => {
  const currentAccount = useCurrentAccount();

  return currentAccount ? (
    <BeaconProvider>
      <WalletConnectProvider>
        <Layout />
      </WalletConnectProvider>
    </BeaconProvider>
  ) : (
    <Welcome />
  );
};
