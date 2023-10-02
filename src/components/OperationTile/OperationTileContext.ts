import React from "react";
import { Address } from "../../types/Address";

export const OperationTileContext = React.createContext<{
  size: "full" | "small";
  selectedAddress?: Address;
}>({
  size: "full",
});
