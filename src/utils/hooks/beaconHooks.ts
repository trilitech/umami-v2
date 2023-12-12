import { useDispatch } from "react-redux";

import { RawPkh } from "../../types/Address";
import { useAppSelector } from "../redux/hooks";
import { beaconSlice } from "../redux/slices/beaconSlice";

/**
 * Returns connected account pkh by given dAppId.
 *
 * @param dAppId - generated from dApp public key.
 */
export const useGetConnectedAccount = (dAppId: string): RawPkh | undefined => {
  const beaconConnections = useAppSelector(s => s.beacon);
  return beaconConnections[dAppId];
};

/**
 * Returns function for removing all connections from {@link beaconSlice}.
 */
export const useResetBeaconConnections = () => {
  const dispatch = useDispatch();
  return () => dispatch(beaconSlice.actions.reset());
};

/**
 * Returns function for adding connection to {@link beaconSlice}.
 */
export const useAddConnectionToSlice = () => {
  const dispatch = useDispatch();
  return (dAppId: string, accountPkh: RawPkh) =>
    dispatch(beaconSlice.actions.addConnection({ dAppId, accountPkh }));
};

/**
 * Returns function for removing connection from {@link beaconSlice}.
 */
export const useRemoveConnectionFromSlice = () => {
  const dispatch = useDispatch();
  return (dAppId: string) => dispatch(beaconSlice.actions.removeConnection({ dAppId }));
};
