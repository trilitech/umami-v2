import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useAddPeer, useSelectNetwork, useSelectedNetwork } from "@umami/state";

import { ImportBackupModal } from "./ImportBackupModal";
import { MenuIcon } from "../../assets/icons";
import { ColorSchemeModeToggle } from "../ColorSchemeModeToggle/ColorSchemeModeToggle";

export const Actions = () => {
  const { openWith } = useDynamicModalContext();
  const addPeer = useAddPeer();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selectNetwork = useSelectNetwork();
  const currentNetwork = useSelectedNetwork();

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
        onClick={onOpen}
        size={{
          base: "md",
          lg: "lg",
        }}
        variant="iconButtonSolid"
      />
      <Drawer isOpen={isOpen} onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody paddingTop="40px">
            <RadioGroup onChange={selectNetwork} value={currentNetwork.name}>
              <Heading>Network</Heading>
              <Stack direction="column">
                <Radio value="mainnet">Mainnet</Radio>
                <Radio value="ghostnet">Ghostnet</Radio>
              </Stack>
            </RadioGroup>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
