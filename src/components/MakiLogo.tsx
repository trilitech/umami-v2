import { IconProps } from "@chakra-ui/react";
import React from "react";

import { MakiIcon } from "../assets/icons";
import { useSelectedNetwork } from "../utils/hooks/networkHooks";

const ORANGE = "#F74F18";

export const MakiLogo: React.FC<IconProps> = props => {
  const network = useSelectedNetwork();

  return (
    <MakiIcon
      background="white"
      borderRadius="8px"
      fishColor={network.name === "mainnet" ? ORANGE : "black"}
      {...props}
    />
  );
};
