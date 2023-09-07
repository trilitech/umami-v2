import { Box, Select } from "@chakra-ui/react";
import { Network, NetworkName } from "../types/Network";
import { useAvailableNetworks, useSelectedNetwork } from "../utils/hooks/networkHooks";
import { useAppDispatch } from "../utils/redux/hooks";
import { networksActions } from "../utils/redux/slices/networks";
import { capitalize } from "lodash";
import colors from "../style/colors";

export const NetworkSelector = () => {
  const currentNetwork = useSelectedNetwork();
  const availableNetworks = useAvailableNetworks();
  const dispatch = useAppDispatch();

  const changeNetwork = (name: NetworkName) => {
    const network = availableNetworks.find(network => network.name === name) as Network;
    dispatch(networksActions.setCurrent(network));
  };

  return (
    <Box width={120}>
      <Select
        data-testid="network-selector"
        border="1px solid transparent"
        fontWeight={600}
        color={colors.green}
        value={currentNetwork.name}
        onChange={e => changeNetwork(e.target.value)}
      >
        {availableNetworks.map(network => (
          <option key={network.name} value={network.name}>
            {capitalize(network.name)}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default NetworkSelector;
