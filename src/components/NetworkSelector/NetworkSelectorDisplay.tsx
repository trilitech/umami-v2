import { Box, Select } from "@chakra-ui/react";
import React from "react";
import { DefaultNetworks, Network } from "../../types/Network";
import { capitalize } from "lodash";

// TODO: merge with NetworkSelector component
// TODO: remove empty option
export const NetworkSelectorDisplay: React.FC<{
  value: Network;
  onChange: (val: Network) => void;
}> = ({ value: network, onChange }) => {
  const availableNetworks = DefaultNetworks; // TODO: add support for custom networks
  return (
    <Box width={120}>
      <Select
        border="1px solid transparent"
        fontWeight={600}
        color="umami.green"
        placeholder="Choose network"
        value={network.name}
        onChange={e => {
          if (e.target.value === "") {
            return;
          }
          onChange(availableNetworks.find(network => network.name === e.target.value) as Network);
        }}
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
