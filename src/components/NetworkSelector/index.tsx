import { TezosNetwork } from "../../types/TezosNetwork";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { useAppDispatch } from "../../utils/redux/hooks";
import assetsSlice from "../../utils/redux/slices/assetsSlice";
import { NetworkSelectorDisplay } from "./NetworkSelectorDisplay";

export const NetworkSelector = () => {
  const network = useSelectedNetwork();
  const dispatch = useAppDispatch();

  const changeNetwork = (network: TezosNetwork) => {
    dispatch(assetsSlice.actions.updateNetwork(network));
  };

  return <NetworkSelectorDisplay value={network} onChange={changeNetwork} />;
};

export default NetworkSelector;
