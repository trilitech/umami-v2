import { useCurrentAccount } from "@umami/state";
import { useEffect } from "react";

import { BeaconProvider } from "./components/beacon";
import { useOnboardingModal } from "./components/Onboarding/useOnboardingModal";
import { Layout } from "./Layout";

export const App = () => {
  const currentAccount = useCurrentAccount();
  const { onOpen: openOnboardingModal, modalElement } = useOnboardingModal();

  useEffect(() => {
    if (!currentAccount) {
      openOnboardingModal();
    }
  }, [currentAccount, openOnboardingModal]);

  return currentAccount ? (
    <BeaconProvider>
      <Layout />
    </BeaconProvider>
  ) : (
    modalElement
  );
};
