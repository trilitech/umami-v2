import { Flex, Icon, IconButton } from "@chakra-ui/react";
import { useDynamicDrawerContext } from "@umami/components";

import { MenuIcon } from "../../assets/icons";
import { ColorSchemeModeToggle } from "../ColorSchemeModeToggle/ColorSchemeModeToggle";
import { Menu } from "../Menu";

export const Actions = () => {
  const { openWith } = useDynamicDrawerContext();

  return (
    <Flex alignItems="center" gap="24px">
      <ColorSchemeModeToggle />
      <IconButton
        aria-label="Open menu"
        icon={
          <Icon
            as={MenuIcon}
            width={{
              base: "18px",
              md: "24px",
            }}
            height="auto"
          />
        }
        isRound
        onClick={() => openWith(<Menu />)}
        size={{
          base: "md",
          md: "lg",
        }}
        variant="iconButtonSolid"
      />
    </Flex>
  );
};
