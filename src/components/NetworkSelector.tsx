import { Box, Select } from "@chakra-ui/react";
import {
  useAvailableNetworks,
  useSelectNetwork,
  useSelectedNetwork,
} from "../utils/hooks/networkHooks";
import { capitalize } from "lodash";
import colors from "../style/colors";

export const NetworkSelector = () => {
  const currentNetwork = useSelectedNetwork();
  const availableNetworks = useAvailableNetworks();
  const selectNetwork = useSelectNetwork();

  return (
    <Box width="105px">
      <Select
        data-testid="network-selector"
        border="1px solid transparent"
        p={0}
        size="xs"
        fontSize="14px"
        fontWeight={600}
        color={colors.green}
        value={currentNetwork.name}
        onChange={e => selectNetwork(e.target.value)}
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
