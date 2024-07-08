import { type IconProps } from "@chakra-ui/react";
import { useSelectedNetwork } from "@umami/state";

import { MakiIcon } from "../assets/icons";

const ORANGE = "#F74F18";

export const MakiLogo = (props: IconProps) => {
  const network = useSelectedNetwork();

  return (
    <MakiIcon
      background="white"
      borderRadius="8px"
      data-testid="maki-logo"
      fishColor={network.name === "mainnet" ? ORANGE : "black"}
      {...props}
    />
  );
};
