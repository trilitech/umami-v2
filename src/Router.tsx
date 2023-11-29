/* istanbul ignore file */
import React, { useEffect, useRef } from "react";
import {
  createHashRouter,
  RouterProvider,
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomeView from "./views/home/HomeView";
import ImportSeed from "./ImportSeed";
import { useImplicitAccounts } from "./utils/hooks/getAccountDataHooks";
import { useAssetsPolling } from "./utils/useAssetsPolling";
import NFTsView from "./views/nfts/NftsView";
import OperationsView from "./views/operations/OperationsView";
import SettingsView from "./views/settings/SettingsView";
import { withSideMenu } from "./views/withSideMenu";
import HelpView from "./views/help/HelpView";
import AddressBookView from "./views/addressBook/AddressBookView";
import BatchPage from "./views/batch/BatchPage";
import { BeaconProvider, resetBeacon } from "./utils/beacon/beacon";
import TokensPage from "./views/tokens/TokensPage";
import { useDeeplinkHandler } from "./utils/useDeeplinkHandler";
import { AnnouncementBanner } from "./components/AnnouncementBanner";
import { DynamicModalContext, useDynamicModal } from "./components/DynamicModal";

// Hash router is required for electron prod build:
// https://stackoverflow.com/a/75648956/6797267

const loggedOutRouter = createHashRouter([
  {
    path: "/welcome",
    element: <ImportSeed />,
  },
  {
    path: "/*",
    element: <Navigate to="/welcome" />,
  },
]);

const MemoizedRouter = React.memo(() => {
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
            <Route element={withSideMenu(<NFTsView />)} path="/nfts/:ownerPkh/:nftId" />
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
});

const LoggedInRouterWithPolling = () => {
  // This does rerenders
  useAssetsPolling();
  return <MemoizedRouter />;
};

// Need this ignore BS because useEffect runs twice in development:
// https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
const LoggedOutRouter = () => {
  const ignore = useRef(false);
  useEffect(() => {
    if (!ignore.current) {
      resetBeacon().then(_ => {
        ignore.current = false;
      });
    }
    return () => {
      ignore.current = true;
    };
  }, []);

  return <RouterProvider router={loggedOutRouter} />;
};

const Router = () => {
  useDeeplinkHandler();
  const isLoggedIn = useImplicitAccounts().length !== 0;

  return isLoggedIn ? <LoggedInRouterWithPolling /> : <LoggedOutRouter />;
};

export default Router;
