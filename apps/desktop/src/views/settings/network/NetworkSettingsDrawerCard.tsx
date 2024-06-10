import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from "@chakra-ui/react";

import { NetworkSettingsDrawerBody } from "./NetworkSettingsDrawerBody";
import { SettingsCardWithDrawerIcon } from "../../../components/ClickableCard";
import { DrawerTopButtons } from "../../../components/DrawerTopButtons";

export const NetworkSettingsDrawerCard = () => {
  const { isOpen: isDrawerOpen, onClose: closeDrawer, onOpen: openDrawer } = useDisclosure();

  return (
    <>
      <SettingsCardWithDrawerIcon
        left="Network Settings"
        isSelected={isDrawerOpen}
        onClick={openDrawer}
      />
      <Drawer
        blockScrollOnMount={false}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <DrawerTopButtons onClose={closeDrawer} />
            <NetworkSettingsDrawerBody />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
