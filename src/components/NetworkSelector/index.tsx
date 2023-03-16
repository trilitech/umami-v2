import { TezosNetwork } from "@airgap/tezos";
import React from "react";
import assetsSlice from "../../utils/store/assetsSlice";
import { useAppDispatch, useAppSelector } from "../../utils/store/hooks";
import { NetworkSelectorDisplay } from "./NetworkSelectorDisplay";

export const NetworkSelector = () => {
  const network = useAppSelector((s) => s.assets.network);
  const dispatch = useAppDispatch();

  const changeNetwork = (network: TezosNetwork) => {
    dispatch(assetsSlice.actions.updateNetwork(network));
  };

  return <NetworkSelectorDisplay value={network} onChange={changeNetwork} />;
};

export default NetworkSelector;
