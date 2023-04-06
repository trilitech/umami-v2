import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
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

// Hash router is required for electron prod build:
// https://stackoverflow.com/a/75648956/6797267

const loggedInRouter = createHashRouter([
  {
    path: "/home",
    element: withSideMenu(<Home />),
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
    path: "/",
    element: withSideMenu(<Home />),
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
  return <RouterProvider router={loggedInRouter} />;
});

const LoggedInRouterWithPolling = () => {
  // This does rerenders
  useAssetsPolling();
  return <MemoizedRouter />;
};

const Router = () => {
  const isLoggedIn = useAccounts().length !== 0;

  return isLoggedIn ? (
    <LoggedInRouterWithPolling />
  ) : (
    <RouterProvider router={loggedOutRouter} />
  );
};

export default Router;
