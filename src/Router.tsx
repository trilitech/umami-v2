import { createHashRouter } from "react-router-dom";
import Home from "./Home";
import ImportSeed from "./ImportSeed";

// Hash router is required for electron prod build:
// https://stackoverflow.com/a/75648956/6797267

export const router = createHashRouter([
  {
    path: "/importSeed",
    element: <ImportSeed />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/",
    element: <ImportSeed />,
  },
]);
