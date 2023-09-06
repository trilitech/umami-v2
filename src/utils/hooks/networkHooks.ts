import { useAppSelector } from "../redux/hooks";

export const useSelectedNetwork = () => {
  return useAppSelector(s => s.networks.current);
};

export const useAvailableNetworks = () => {
  return useAppSelector(s => s.networks.available);
};
