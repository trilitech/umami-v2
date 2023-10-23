import { useContext } from "react";
import { RawPkh } from "../../types/Address";
import { OperationTileContext } from "./OperationTileContext";

export const useShowAddress = (address?: RawPkh) => {
  if (!address) {
    return false;
  }
  const tileContext = useContext(OperationTileContext);
  if (tileContext.mode === "page") {
    return true;
  }
  return tileContext.selectedAddress.pkh !== address;
};
