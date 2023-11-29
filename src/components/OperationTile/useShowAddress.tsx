import { useContext } from "react";

import { OperationTileContext } from "./OperationTileContext";
import { RawPkh } from "../../types/Address";

export const useShowAddress = (address: RawPkh) => {
  const tileContext = useContext(OperationTileContext);

  if (!address) {
    return false;
  }

  if (tileContext.mode === "page") {
    return true;
  }
  return tileContext.selectedAddress.pkh !== address;
};
