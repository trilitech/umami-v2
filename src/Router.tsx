import React, { useEffect, useRef } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import HomeView from "./views/home/HomeView";
import ImportSeed from "./ImportSeed";
import { useAccounts } from "./utils/hooks/accountHooks";
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

// Hash router is required for electron prod build:
// https://stackoverflow.com/a/75648956/6797267

const loggedInRouter = createHashRouter([
  {
    path: "/home",
    element: withSideMenu(<HomeView />),
  },

  {
    path: "/nfts",
    element: withSideMenu(<NFTsView />),
  },

  {
    path: "/operations",
    element: withSideMenu(<OperationsView />),
  },

  {
    path: "/delegations",
    element: withSideMenu(<DelegationsView />),
  },

  {
    path: "/address-book",
    element: withSideMenu(<AddressBookView />),
  },

  {
    path: "/settings",
    element: withSideMenu(<SettingsView />),
  },

  {
    path: "/help",
    element: withSideMenu(<HelpView />),
  },

  {
    path: "/batch",
    element: withSideMenu(<BatchView />),
  },
  {
    path: "/",
    element: withSideMenu(<HomeView />),
  },
]);

const loggedOutRouter = createHashRouter([
  {
    path: "/importSeed",
    element: <ImportSeed />,
  },
  {
    path: "/",
    element: <ImportSeed />,
  },
]);

const MemoizedRouter = React.memo(() => {
  const beaconNotificationModal = useBeaconInit();
  return (
    <>
      <RouterProvider router={loggedInRouter} />
      {beaconNotificationModal}
    </>
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
      resetBeacon().then((_) => {
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
  const isLoggedIn = useAccounts().length !== 0;

  return isLoggedIn ? <LoggedInRouterWithPolling /> : <LoggedOutRouter />;
};

export default Router;
