import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { SettingsCardWithDrawerIcon } from "../../components/ClickableCard";
import { useDynamicModal } from "../../components/DynamicModal";
import { useAddPeer } from "../../utils/beacon/beacon";
import { BeaconPeers } from "../../utils/beacon/BeaconPeers";
import { DrawerTopButtons } from "../home/DrawerTopButtons";

export const DAppsDrawerCard = () => {
  const { isOpen, onClose: closeDrawer, onOpen } = useDisclosure();
  const { isOpen: isDynamicModalOpen } = useDynamicModal();
  return (
    <>
      <SettingsCardWithDrawerIcon left="dApps" isSelected={isOpen} onClick={onOpen} />
      <Drawer
        autoFocus={false}
        blockScrollOnMount={!isDynamicModalOpen}
        isOpen={isOpen}
        onClose={closeDrawer}
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <DrawerTopButtons onClose={closeDrawer} />
            <DAppsDrawerBody />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const DAppsDrawerBody = () => {
  const addPeer = useAddPeer();
  return (
    <Box>
      <Flex alignItems="center" justifyContent="space-between" height={24}>
        <Heading>dApps</Heading>
      </Flex>
      <Button
        onClick={() =>
          navigator.clipboard.readText().then(text => {
            addPeer(text);
          })
        }
      >
        Connect with Pairing Request
      </Button>
      <Text marginTop="16px" marginBottom="32px" color="text.dark">
        or open a deeplink from inside the dApp...
      </Text>
      <BeaconPeers />
    </Box>
  );
};
