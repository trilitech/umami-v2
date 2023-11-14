import { useContext } from "react";
import { RawPkh } from "../../types/Address";
import { OperationTileContext } from "./OperationTileContext";

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
