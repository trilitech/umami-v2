import { useDispatch } from "react-redux";

import { useAppSelector } from "./useAppSelector";
import { assetsActions, networksActions } from "../slices";

export const useSelectedNetwork = () => useAppSelector(s => s.networks.current);

export const useBuyTezUrl = (pkh?: string) => {
  const network = useSelectedNetwork();
  let buyTezUrl = network.buyTezUrl;

  if (buyTezUrl && network.name === "mainnet") {
    buyTezUrl += `/default/widget/?commodity=XTZ&address=${pkh}&network=tezos&commodity_id=xtz.simple.tezos`;
  }

  return buyTezUrl;
};

export const useAvailableNetworks = () => useAppSelector(s => s.networks.available);

export const useFindNetwork = () => {
  const availableNetworks = useAvailableNetworks();

  return (name: string) =>
    availableNetworks.find(network => network.name.toLowerCase() === name.toLowerCase());
};

/**
 * Changes network
 * Also cleans accounts state (such as balance, staked balance, etc.)
 */
export const useSelectNetwork = () => {
  const availableNetworks = useAvailableNetworks();
  const dispatch = useDispatch();

  return (name: string) => {
    const network = availableNetworks.find(network => network.name === name);
    if (!network) {
      return;
    }
    dispatch(networksActions.setCurrent(network));
    dispatch(assetsActions.cleanAccountStates());
  };
};
