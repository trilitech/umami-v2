import { useHandleSession } from "@umami/state";

import { Layout } from "../../Layout";
import { SessionLogin } from "../../views/SessionLogin/SessionLogin";
import { Welcome } from "../../views/Welcome";
import { BeaconProvider } from "../beacon";
import { WalletConnectProvider } from "../WalletConnect/WalletConnectProvider";

export const App = () => {
  const { isSessionActive, isOnboarded } = useHandleSession();

  if (!isSessionActive) {
    if (isOnboarded()) {
      return <SessionLogin />;
    }
    return <Welcome />;
  } else {
    return (
      <BeaconProvider>
        <WalletConnectProvider>
          <Layout />
        </WalletConnectProvider>
      </BeaconProvider>
    );
  }
};
