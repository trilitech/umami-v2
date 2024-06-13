import { useSelectedNetwork } from "./networkHooks";
import { useAppSelector } from "../redux/hooks";

// TODO: test
export const useGetProtocolSettings = () => {
  const network = useSelectedNetwork();
  return useAppSelector(state => state.protocolSettings[network.name]);
};
