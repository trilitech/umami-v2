import { Card, Icon, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

import { Actions } from "./Actions";
import { LogoDarkIcon, LogoLightIcon } from "../../assets/icons";

export const Header = () => {
  const colorMode = useColorMode();
  const size = useBreakpointValue({
    base: {
      width: "42px",
      height: "42px",
    },
    lg: {
      width: "48px",
      height: "48px",
    },
  });

  return (
    <Card
      justifyContent="space-between"
      flexDirection="row"
      padding={{ base: "6px 12px", lg: "10px 20px" }}
      borderRadius={{ base: 0, lg: "100px" }}
      boxShadow={{
        base: "0px 4px 10px 0px rgba(45, 55, 72, 0.06)",
        lg: "2px 4px 12px 0px rgba(45, 55, 72, 0.05)",
      }}
    >
      {mode(<Icon as={LogoLightIcon} {...size} />, <Icon as={LogoDarkIcon} {...size} />)(colorMode)}
      <Actions />
    </Card>
  );
};
