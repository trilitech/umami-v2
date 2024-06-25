import { Flex, IconButton } from "@chakra-ui/react";

import { MenuIcon } from "../../assets/icons/Menu";
import { ColorSchemeModeToggle } from "../ColorSchemeModeToggle/ColorSchemeModeToggle";

export const Actions = () => (
  <Flex alignItems="center" gap="24px">
    <ColorSchemeModeToggle />
    <IconButton
      aria-label="Open menu"
      icon={<MenuIcon width="18px" height="18px" />}
      isRound
      variant="solid"
    />
  </Flex>
);
