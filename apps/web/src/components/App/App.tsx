import { useHandleSession } from "@umami/state";

import { Layout } from "../../Layout";
import { SessionLogin } from "../../views/SessionLogin/SessionLogin";
import { Welcome } from "../../views/Welcome";
import { BeaconProvider } from "../beacon";
import { WalletConnectProvider } from "../WalletConnect/WalletConnectProvider";

export const App = () => {
  const { isSessionActive, isOnboarded } = useHandleSession();

  if (!isOnboarded()) {
    return <Welcome />;
  } else if (!isSessionActive) {
    return <SessionLogin />;
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
