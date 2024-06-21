import { Card, useColorMode } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

import { HeaderActions } from "./HeaderActions";
import { LogoDarkIcon } from "../../assets/icons/LogoDark";
import { LogoLightIcon } from "../../assets/icons/LogoLight";

export const Header = () => {
  const { colorMode } = useColorMode();
  return (
    <Card
      justifyContent="space-between"
      flexDirection="row"
      padding="10px 20px"
      borderRadius="100px"
    >
      {mode(
        <LogoLightIcon width="48px" height="48px" />,
        <LogoDarkIcon width="48px" height="48px" />
      )({ colorMode })}
      <HeaderActions />
    </Card>
  );
};
