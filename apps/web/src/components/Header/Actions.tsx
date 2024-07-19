import { Button, Flex, IconButton } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useAddPeer } from "@umami/state";

import { ImportBackupModal } from "./ImportBackupModal";
import { MenuIcon } from "../../assets/icons";
import { ColorSchemeModeToggle } from "../ColorSchemeModeToggle/ColorSchemeModeToggle";

export const Actions = () => {
  const { openWith } = useDynamicModalContext();
  const addPeer = useAddPeer();

  return (
    <Flex alignItems="center" gap="24px">
      <ColorSchemeModeToggle />
      <Button onClick={() => openWith(<ImportBackupModal />)} size="sm" variant="primary">
        Import Backup
      </Button>
      <Button onClick={() => navigator.clipboard.readText().then(text => addPeer(text))} size="sm">
        Add Beacon
      </Button>
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
};
