import { TezosNetwork } from "@airgap/tezos";
import { Box, Select } from "@chakra-ui/react";
import React from "react";

export const NetworkSelectorDisplay: React.FC<{
  value: TezosNetwork;
  onChange: (val: TezosNetwork) => void;
}> = ({ value, onChange }) => {
  return (
    <Box width={120}>
      <Select
        border="1px solid transparent"
        fontWeight={600}
        color="umami.orange"
        placeholder="Choose network"
        value={value}
        onChange={e => {
          if (e.target.value === "") {
            return;
          }
          onChange(e.target.value as TezosNetwork);
        }}
      >
        <option value={TezosNetwork.GHOSTNET}>{"Ghostnet"}</option>
        <option value={TezosNetwork.MAINNET}>{"Mainnet"}</option>
      </Select>
    </Box>
  );
};
