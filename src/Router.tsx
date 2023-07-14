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
import { useImplicitAccounts } from "./utils/hooks/accountHooks";
import { useAssetsPolling } from "./utils/useAssetsPolling";
import NFTsView from "./views/nfts/NftsView";
import OperationsView from "./views/operations/OperationsView";
import SettingsView from "./views/settings/SettingsView";
import { withSideMenu } from "./views/withSideMenu";
import HelpView from "./views/help/HelpView";
import DelegationsView from "./views/delegations/DelegationsView";
import AddressBookView from "./views/addressBook/AddressBookView";
import BatchView from "./views/batch/BatchView";
import { resetBeacon, useBeaconInit } from "./utils/beacon/beacon";
import TokensView from "./views/tokens/TokensView";
import { useDeeplinkHandler } from "./utils/useDeeplinkHandler";
import { AnnouncementBanner } from "./components/AnnouncementBanner";

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
  const beaconNotificationModal = useBeaconInit();
  return (
    <HashRouter>
      <AnnouncementBanner />
      <Routes>
        <Route path="/home" element={withSideMenu(<HomeView />)} />
        <Route path="/nfts" element={withSideMenu(<NFTsView />)} />
        <Route path="/nfts/:ownerPkh/:nftId" element={withSideMenu(<NFTsView />)} />
        <Route path="/operations" element={withSideMenu(<OperationsView />)} />
        <Route path="/delegations" element={withSideMenu(<DelegationsView />)} />
        <Route path="/tokens" element={withSideMenu(<TokensView />)} />
        <Route path="/address-book" element={withSideMenu(<AddressBookView />)} />
        <Route path="/settings" element={withSideMenu(<SettingsView />)} />
        <Route path="/help" element={withSideMenu(<HelpView />)} />
        <Route path="/batch" element={withSideMenu(<BatchView />)} />
        <Route path="/*" element={<Navigate to="/home" />} />
      </Routes>
      {beaconNotificationModal}
    </HashRouter>
  );
});

const LoggedInRouterWithPolling = () => {
  // This does rerenders
  useAssetsPolling();
  useDeeplinkHandler();
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
  const isLoggedIn = useImplicitAccounts().length !== 0;

  return isLoggedIn ? <LoggedInRouterWithPolling /> : <LoggedOutRouter />;
};

export default Router;
