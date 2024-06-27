import { useAppSelector } from "@umami/state";

import { useSelectedNetwork } from "./networkHooks";

// TODO: test
export const useGetProtocolSettings = () => {
  const network = useSelectedNetwork();
  return useAppSelector(state => state.protocolSettings[network.name]);
};
