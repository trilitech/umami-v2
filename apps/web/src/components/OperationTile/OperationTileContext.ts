import { type Address } from "@umami/tezos";
import { createContext } from "react";

export type OperationTileContextType =
  | { mode: "page" }
  | { mode: "drawer"; selectedAddress: Address };

// TODO: remove it for the web, it's not needed
export const OperationTileContext = createContext<OperationTileContextType>({
  mode: "page",
});
