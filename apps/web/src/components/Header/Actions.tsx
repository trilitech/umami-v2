import { Button, Flex, Icon, IconButton } from "@chakra-ui/react";
import { useDynamicDrawerContext } from "@umami/components";
import { useAddPeer } from "@umami/state";

import { MenuIcon } from "../../assets/icons";
import { ColorSchemeModeToggle } from "../ColorSchemeModeToggle/ColorSchemeModeToggle";
import { Menu } from "../Menu";

export const Actions = () => {
  const { openWith } = useDynamicDrawerContext();
  const addPeer = useAddPeer();

  return (
    <Flex alignItems="center" gap="24px">
      <ColorSchemeModeToggle />
      <Button onClick={() => navigator.clipboard.readText().then(text => addPeer(text))} size="sm">
        Add Beacon
      </Button>
      <IconButton
        aria-label="Open menu"
        icon={
          <Icon
            as={MenuIcon}
            width={{
              base: "18px",
              lg: "24px",
            }}
            height="auto"
          />
        }
        isRound
        onClick={() => openWith(<Menu />)}
        size={{
          base: "md",
          lg: "lg",
        }}
        variant="iconButtonSolid"
      />
    </Flex>
  );
};
