import { type Address } from "@umami/tezos";
import React from "react";

export type OperationTileContextType =
  | { mode: "page" }
  | { mode: "drawer"; selectedAddress: Address };

export const OperationTileContext = React.createContext<OperationTileContextType>({
  mode: "page",
});
