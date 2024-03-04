import { NetworkType } from "@airgap/beacon-wallet";
import { useDispatch } from "react-redux";

import { RawPkh } from "../../types/Address";
import { useAppSelector } from "../redux/hooks";
import { beaconSlice } from "../redux/slices/beaconSlice";

/**
 * Returns function to get connected accounts stored in {@link beaconSlice} by dAppId.
 */
export const useGetConnectedAccounts = () => {
  const beaconConnections = useAppSelector(s => s.beacon);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (dAppId: string): RawPkh[] => Object.keys(beaconConnections[dAppId] || {});
};

/**
 * Returns function to get connection network type stored in {@link beaconSlice} by dAppId & accountPkh.
 */
export const useGetConnectionNetworkType = () => {
  const beaconConnections = useAppSelector(s => s.beacon);

  return (dAppId: string, accountPkh: RawPkh) => beaconConnections[dAppId][accountPkh];
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
  return (dAppId: string, accountPkh: RawPkh) =>
    dispatch(beaconSlice.actions.removeConnection({ dAppId, accountPkh }));
};
