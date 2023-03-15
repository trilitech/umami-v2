import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import ImportSeed from "./ImportSeed";
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

const Router = () => {
  const isLoggedIn = useAppSelector((s) => s.accounts).items.length !== 0;

  return isLoggedIn ? (
    <RouterProvider router={loggedInRouter} />
  ) : (
    <RouterProvider router={loggedOutRouter} />
  );
};

export default Router;
