import { Box, Select } from "@chakra-ui/react";
import React from "react";
import { Network } from "../../types/Network";

export const NetworkSelectorDisplay: React.FC<{
  value: Network;
  onChange: (val: Network) => void;
}> = ({ value, onChange }) => {
  return (
    <Box width={120}>
      <Select
        border="1px solid transparent"
        fontWeight={600}
        color="umami.green"
        placeholder="Choose network"
        value={value}
        onChange={e => {
          if (e.target.value === "") {
            return;
          }
          onChange(e.target.value as Network);
        }}
      >
        <option value="ghostnet">Ghostnet</option>
        <option value="mainnet">Mainnet</option>
      </Select>
    </Box>
  );
};
