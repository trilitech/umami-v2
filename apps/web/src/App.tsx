import { useCurrentAccount } from "@umami/state";
import { useEffect } from "react";

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

  return currentAccount ? <Layout /> : modalElement;
};
