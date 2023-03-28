import { TezosNetwork } from "@airgap/tezos";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import assetsSlice from "../../utils/store/assetsSlice";
import { useAppDispatch } from "../../utils/store/hooks";
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
