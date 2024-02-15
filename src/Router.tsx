/* istanbul ignore file */
import { noop } from "lodash";
import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import { AnnouncementBanner } from "./components/AnnouncementBanner";
import { DynamicModalContext, useDynamicModal } from "./components/DynamicModal";
import { BeaconProvider, resetBeacon } from "./utils/beacon/beacon";
import { useResetConnections } from "./utils/hooks/beaconHooks";
import { useImplicitAccounts } from "./utils/hooks/getAccountDataHooks";
import { useAssetsPolling } from "./utils/useAssetsPolling";
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
  useAssetsPolling();
  const dynamicModal = useDynamicModal();

  return (
    <HashRouter>
      <DynamicModalContext.Provider value={dynamicModal}>
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
          {dynamicModal.content}
        </BeaconProvider>
      </DynamicModalContext.Provider>
    </HashRouter>
  );
};

const LoggedOutRouter = () => {
  const resetBeaconConnections = useResetConnections();

  useEffect(() => {
    resetBeacon().then(resetBeaconConnections).catch(noop);
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
