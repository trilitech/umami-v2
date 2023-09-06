import { Network } from "../../types/Network";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useAppDispatch } from "../../utils/redux/hooks";
import { networksActions } from "../../utils/redux/slices/networks";
import { NetworkSelectorDisplay } from "./NetworkSelectorDisplay";

export const NetworkSelector = () => {
  const network = useSelectedNetwork();
  const dispatch = useAppDispatch();

  const changeNetwork = (network: Network) => {
    dispatch(networksActions.setCurrent(network));
  };

  return <NetworkSelectorDisplay value={network} onChange={changeNetwork} />;
};

export default NetworkSelector;
