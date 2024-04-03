import { useContext } from "react";

import { OperationTileContext } from "./OperationTileContext";
import { RawPkh } from "../../types/Address";

/**
 * Hook to determine if the address should be shown in the tile
 *
 * in a page mode it's shown if it's present
 * in a drawer mode it's shown if it's different from the selected address
 *
 * @param address - address to compare with the selected address
 * @returns boolean
 */
export const useShowAddress = (address: RawPkh | null | undefined) => {
  const tileContext = useContext(OperationTileContext);

  if (!address) {
    return false;
  }

  if (tileContext.mode === "page") {
    return true;
  }
  return tileContext.selectedAddress.pkh !== address;
};
