import { useSelectedNetwork } from "./network";
import { useAppSelector } from "./useAppSelector";

export const useGetProtocolSettings = () => {
  const network = useSelectedNetwork();
  return useAppSelector(state => state.protocolSettings[network.name]);
};
