/* istanbul ignore file */
import { DynamicModalContext, useDynamicModal } from "@umami/components";
import { useDataPolling } from "@umami/data-polling";
import {
  WalletClient,
  useCurrentAccount,
  useImplicitAccounts,
  useResetBeaconConnections,
} from "@umami/state";
import { noop } from "lodash";
import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import { AnnouncementBanner } from "./components/AnnouncementBanner";
import { SocialLoginWarningModal } from "./components/SocialLoginWarningModal/SocialLoginWarningModal";
import { BeaconProvider } from "./utils/beacon/BeaconProvider";
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
import { persistor } from "./utils/persistor";

// Hash router is required for electron prod build:
// https://stackoverflow.com/a/75648956/6797267

export const Router = () => {
  useDeeplinkHandler();
  const isLoggedIn = useImplicitAccounts().length > 0;

  useEffect(() => {
    window.electronAPI.onBackupData((event, backupData) => {
      // Restore the backup data
      console.log("Backup data received: ", backupData);
            
      if(localStorage.getItem("isBackupLoaded") !== "true") {

      persistor.pause();
      localStorage.clear();
      localStorage.setItem("persist:accounts", backupData["persist:accounts"]);
      localStorage.setItem("persist:root", backupData["persist:root"]);
      localStorage.setItem("isBackupLoaded", "true");
      console.log("Backup data loaded");
    window.location.reload();
    }}
  );
  }, []);

  return isLoggedIn ? <LoggedInRouterWithPolling /> : <LoggedOutRouter />;
};

const LoggedInRouterWithPolling = () => {
  useDataPolling();
  const modalDisclosure = useDynamicModal();
  const currentUser = useCurrentAccount();

  useEffect(() => {
    if (currentUser?.type === "social") {
      const isInformed = localStorage.getItem("user:isSocialLoginWarningShown");

      if (!isInformed || !JSON.parse(isInformed)) {
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

  return (
    <HashRouter>
      <Routes>
        <Route element={<Navigate to="/welcome" />} path="/*" />
        <Route element={<WelcomeScreen />} path="/welcome" />
      </Routes>
    </HashRouter>
  );
};
