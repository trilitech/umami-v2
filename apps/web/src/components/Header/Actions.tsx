import { Flex, IconButton } from "@chakra-ui/react";

import { MenuIcon } from "../../assets/icons";
import { ColorSchemeModeToggle } from "../ColorSchemeModeToggle/ColorSchemeModeToggle";

export const Actions = () => (
  <Flex alignItems="center" gap="24px">
    <ColorSchemeModeToggle />
    <IconButton
      aria-label="Open menu"
      icon={<MenuIcon />}
      isRound
      size={{
        base: "md",
        lg: "lg",
      }}
      variant="iconButtonSolid"
    />
  </Flex>
);
