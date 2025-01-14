/* istanbul ignore file */
import { DynamicModalContext, useDynamicModal } from "@umami/components";
import { useDataPolling } from "@umami/data-polling";
import {
  WalletClient,
  useCurrentAccount,
  useGetUserAlerts,
  useImplicitAccounts,
  useResetBeaconConnections,
} from "@umami/state";
import { noop } from "lodash";
import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import { AnnouncementBanner } from "./components/AnnouncementBanner";
import { SocialLoginWarningModal } from "./components/SocialLoginWarningModal/SocialLoginWarningModal";
import { BeaconProvider } from "./utils/beacon/BeaconProvider";
import { persistor } from "./utils/persistor";
import { useDeeplinkHandler } from "./utils/useDeeplinkHandler";
import { AddressBookView } from "./views/addressBook/AddressBookView";
import { BatchPage } from "./views/batch/BatchPage";
import { HelpView } from "./views/help/HelpView";
import { HomeView } from "./views/home/HomeView";
import { NFTsView } from "./views/nfts/NftsView";
import { OperationsView } from "./views/operations/OperationsView";
import { SettingsView } from "./views/settings/SettingsView";
import { TokensPage } from "./views/tokens/TokensPage";
import { withSideMenu } from "./views/withSideMenu";
import { WelcomeScreen } from "./WelcomeScreen";

// Hash router is required for electron prod build:
// https://stackoverflow.com/a/75648956/6797267

export const Router = () => {
  useDeeplinkHandler();
  const isLoggedIn = useImplicitAccounts().length > 0;

  return isLoggedIn ? <LoggedInRouterWithPolling /> : <LoggedOutRouter />;
};

const LoggedInRouterWithPolling = () => {
  useDataPolling();
  const modalDisclosure = useDynamicModal();
  const currentUser = useCurrentAccount();
  const getUserAlerts = useGetUserAlerts();

  useEffect(() => {
    if (currentUser?.type === "social") {
      const isInformed = getUserAlerts("isSocialLoginWarningShown");

      if (!isInformed) {
        void modalDisclosure.openWith(<SocialLoginWarningModal />, { closeOnEsc: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <HashRouter>
      <DynamicModalContext.Provider value={modalDisclosure}>
        <BeaconProvider>
          <AnnouncementBanner />
          <Routes>
            <Route element={withSideMenu(<HomeView />)} path="/home" />
            <Route element={withSideMenu(<HomeView />)} path="/home/:ownerPkh/:nftId" />
            <Route element={withSideMenu(<NFTsView />)} path="/nfts" />
            <Route element={withSideMenu(<OperationsView />)} path="/operations" />
            <Route element={withSideMenu(<TokensPage />)} path="/tokens" />
            <Route element={withSideMenu(<AddressBookView />)} path="/address-book" />
            <Route element={withSideMenu(<SettingsView />)} path="/settings" />
            <Route element={withSideMenu(<HelpView />)} path="/help" />
            <Route element={withSideMenu(<BatchPage />)} path="/batch" />
            <Route element={<Navigate to="/home" />} path="/*" />
          </Routes>
          {modalDisclosure.content}
        </BeaconProvider>
      </DynamicModalContext.Provider>
    </HashRouter>
  );
};

const LoggedOutRouter = () => {
  const resetBeaconConnections = useResetBeaconConnections();

  useEffect(() => {
    WalletClient.destroy().then(resetBeaconConnections).catch(noop);
  }, [resetBeaconConnections]);

  useEffect(() => {
    if (localStorage.getItem("migration_to_2_3_5_completed")) {
      return;
    }

    const getBackupData = async () => {
      const backupData = await window.electronAPI.getBackupData();

      if (!backupData) {
        localStorage.setItem("migration_to_2_3_5_completed", "true");
        return;
      }

      persistor.pause();

      await persistor.flush();
      localStorage.clear();

      localStorage.setItem("migration_to_2_3_5_completed", "true");
      localStorage.setItem("persist:accounts", JSON.stringify(backupData["persist:accounts"]));
      localStorage.setItem("persist:root", JSON.stringify(backupData["persist:root"]));

      persistor.persist();

      window.location.reload();
    };

    getBackupData().catch(() => {});
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route element={<Navigate to="/welcome" />} path="/*" />
        <Route element={<WelcomeScreen />} path="/welcome" />
      </Routes>
    </HashRouter>
  );
};
