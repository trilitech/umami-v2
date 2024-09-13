import { useCurrentAccount } from "@umami/state";

import { Layout } from "../../Layout";
import { Welcome } from "../../views/Welcome";
import { BeaconProvider } from "../beacon";
import { WalletConnectProvider } from "../WalletConnect";
import Modal from "../WalletConnect/Modal";

export const App = () => {
  const currentAccount = useCurrentAccount();

  return currentAccount ? (
    <BeaconProvider>
      <WalletConnectProvider>
        <Layout />
        <Modal />
      </WalletConnectProvider>
    </BeaconProvider>
  ) : (
    <Welcome />
  );
};
