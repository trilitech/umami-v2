import React from "react";

import { type Address } from "../../types/Address";

export type OperationTileContextType =
  | { mode: "page" }
  | { mode: "drawer"; selectedAddress: Address };

export const OperationTileContext = React.createContext<OperationTileContextType>({
  mode: "page",
});
