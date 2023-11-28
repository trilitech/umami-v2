import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from "@chakra-ui/react";
import { DynamicModalContext } from "../../../components/DynamicModal";
import { DrawerTopButtons } from "../../home/DrawerTopButtons";
import { SettingsCardWithDrawerIcon } from "../../../components/ClickableCard";
import { useContext } from "react";
import { NetworkSettingsDrawerBody } from "./NetworkSettingsDrawerBody";

export const NetworkSettingsDrawerCard = () => {
  const { isOpen: isDrawerOpen, onClose: closeDrawer, onOpen: openDrawer } = useDisclosure();
  const { isOpen: isDynamicModalOpen } = useContext(DynamicModalContext);

  return (
    <>
      <SettingsCardWithDrawerIcon
        left="Network Settings"
        onClick={openDrawer}
        isSelected={isDrawerOpen}
      />
      <Drawer
        blockScrollOnMount={!isDynamicModalOpen}
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
