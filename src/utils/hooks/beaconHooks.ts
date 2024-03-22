import { NetworkType } from "@airgap/beacon-wallet";
import { useDispatch } from "react-redux";

import { RawPkh } from "../../types/Address";
import { useAppSelector } from "../redux/hooks";
import { DAppConnectionInfo, beaconSlice } from "../redux/slices/beaconSlice";

/**
 * Returns connected account pkh & network by a given dAppId.
 *
 * @param dAppId - generated from dApp public key.
 */
export const useGetConnectionInfo = (dAppId: string): DAppConnectionInfo | undefined => {
  const beaconConnections = useAppSelector(s => s.beacon);
  return beaconConnections[dAppId];
};

export const useGetPeersForAccounts = () => {
  const beaconConnections = useAppSelector(s => s.beacon);

  return (pkhs: RawPkh[]) =>
    Object.entries(beaconConnections)
      .filter(([_, connectionInfo]) => pkhs.includes(connectionInfo.accountPkh))
      .map(([dAppId, _]) => dAppId);
};

/**
 * Returns function for removing all connections from {@link beaconSlice}.
 */
export const useResetConnections = () => {
  const dispatch = useDispatch();
  return () => dispatch(beaconSlice.actions.reset());
};

/**
 * Returns function for adding connection info to {@link beaconSlice}.
 */
export const useAddConnection = () => {
  const dispatch = useDispatch();
  return (dAppId: string, accountPkh: RawPkh, networkType: NetworkType) =>
    dispatch(beaconSlice.actions.addConnection({ dAppId, accountPkh, networkType }));
};

/**
 * Returns function for removing connection from {@link beaconSlice}.
 */
export const useRemoveConnection = () => {
  const dispatch = useDispatch();
  return (dAppId: string) => dispatch(beaconSlice.actions.removeConnection(dAppId));
};
