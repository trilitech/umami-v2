import React from "react";
import { Address } from "../../types/Address";

export const OperationTileContext = React.createContext<
  { mode: "page" } | { mode: "drawer"; selectedAddress: Address }
>({
  mode: "page",
});
