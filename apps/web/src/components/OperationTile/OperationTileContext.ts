import { type Address } from "@umami/tezos";
import { createContext } from "react";

export type OperationTileContextType =
  | { mode: "page" }
  | { mode: "drawer"; selectedAddress: Address };

export const OperationTileContext = createContext<OperationTileContextType>({
  mode: "page",
});
