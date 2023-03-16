import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import ImportSeed from "./ImportSeed";
import { useAssetsPolling } from "./utils/useAssetsPolling";
import { useAppSelector } from "./utils/store/hooks";

// Hash router is required for electron prod build:
// https://stackoverflow.com/a/75648956/6797267

const loggedInRouter = createHashRouter([
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/",
    element: <Home />,
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
