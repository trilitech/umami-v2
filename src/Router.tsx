import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import ImportSeed from "./ImportSeed";
import { useAppSelector } from "./utils/store/hooks";
import { useAssetsPolling } from "./utils/useAssetsPolling";
import { withSideMenu } from "./views/withSideMenu";
import NFTsView from "./views/nfts/NftsView";
import SettingsView from "./views/settings/SettingsView";

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
  const isLoggedIn = useAppSelector((s) => s.accounts).items.length !== 0;

  return isLoggedIn ? (
    <LoggedInRouterWithPolling />
  ) : (
    <RouterProvider router={loggedOutRouter} />
  );
};

export default Router;
