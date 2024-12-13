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
import { useEffect, useState } from "react";
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

  const [backupData, setBackupData] = useState({});

  useEffect(() => {
    // @ts-ignore
    window.electronAPI.onBackupData((_, backupData) => {
      console.log(backupData);
      setBackupData(backupData);
    });
  }, []);

  useEffect(() => {
    if (Object.keys(backupData).length > 0) {
      try {
        const accountsValue = backupData["persist:accounts"].accountsValue.slice(1); // Remove the \u0001 prefix
        const rootValue = backupData["persist:root"].rootValue.slice(1); // Remove the \u0001 prefix
        // Step 2: Parse the outer JSON string
        const parsedAccounts = JSON.parse(accountsValue);
        const sanitizedRootValue = backupData["persist:root"].rootValue.replaceAll(
          /[\u0000-\u001F\u007F-\u009F]/g,
          ""
        );
        const parsedRootValue = JSON.parse(sanitizedRootValue);

        // Step 3: Parse the inner strings as needed
        parsedAccounts.items = JSON.parse(parsedAccounts.items);
        parsedAccounts.seedPhrases = JSON.parse(parsedAccounts.seedPhrases);
        parsedAccounts.secretKeys = JSON.parse(parsedAccounts.secretKeys);
        parsedAccounts._persist = JSON.parse(parsedAccounts._persist);
        parsedAccounts.current = JSON.parse(parsedAccounts.current);


        console.log(parsedAccounts, "parsedAccounts");
        console.log(parsedRootValue, "parsedRootValue");

        persistor.pause();
        // localStorage.clear();
        localStorage.setItem("persist:accounts", JSON.stringify(parsedAccounts));
        localStorage.setItem("persist:root", JSON.stringify(parsedRootValue));
        // window.location.reload();
      } catch (error) {
        console.error("Error during backup restoration", error);
      }
    }
  }, [backupData]);

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
