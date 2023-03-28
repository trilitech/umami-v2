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
    path: "/settings",
    element: withSideMenu(<SettingsView />),
  },
  {
    path: "/operations",
    element: withSideMenu(<OperationsView />),
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
