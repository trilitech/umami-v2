import { RawPkh } from "../../types/Address";
import { useAppSelector } from "../redux/hooks";

export const useGetConnectedAccount = (dAppId: string): RawPkh | undefined => {
  const beaconConnections = useAppSelector(s => s.beacon);
  return beaconConnections[dAppId];
};
