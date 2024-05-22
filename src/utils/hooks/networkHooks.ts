import { useDispatch } from "react-redux";

import { useAppSelector } from "../redux/hooks";
import { networksActions } from "../redux/slices/networks";

export const useSelectedNetwork = () => useAppSelector(s => s.networks.current);

export const useAvailableNetworks = () => useAppSelector(s => s.networks.available);

export const useFindNetwork = () => {
  const availableNetworks = useAvailableNetworks();

  return (name: string) =>
    availableNetworks.find(network => network.name.toLowerCase() === name.toLowerCase());
};

export const useSelectNetwork = () => {
  const availableNetworks = useAvailableNetworks();
  const dispatch = useDispatch();
  return (name: string) => {
    const network = availableNetworks.find(network => network.name === name);
    if (!network) {
      return;
    }
    dispatch(networksActions.setCurrent(network));
  };
};
