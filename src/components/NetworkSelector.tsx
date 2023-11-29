import { Box, Select } from "@chakra-ui/react";
import { capitalize } from "lodash";

import colors from "../style/colors";
import {
  useAvailableNetworks,
  useSelectNetwork,
  useSelectedNetwork,
} from "../utils/hooks/networkHooks";

export const NetworkSelector = () => {
  const currentNetwork = useSelectedNetwork();
  const availableNetworks = useAvailableNetworks();
  const selectNetwork = useSelectNetwork();

  return (
    <Box width="105px">
      <Select
        padding={0}
        color={colors.green}
        fontSize="14px"
        fontWeight={600}
        border="1px solid transparent"
        data-testid="network-selector"
        onChange={e => selectNetwork(e.target.value)}
        size="xs"
        value={currentNetwork.name}
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
