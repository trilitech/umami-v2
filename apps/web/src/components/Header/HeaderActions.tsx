import { Flex } from "@chakra-ui/react";

import { ColorSchemeModeToggle } from "../ColorSchemeModeToggle/ColorSchemeModeToggle";

export const HeaderActions = () => (
  <Flex alignItems="center">
    <ColorSchemeModeToggle />
  </Flex>
);
