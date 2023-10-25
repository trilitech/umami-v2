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
import { useAddPeer } from "../../utils/beacon/beacon";
import BeaconPeers from "../../utils/beacon/BeaconPeers";
import { DrawerTopButtons } from "../home/DrawerTopButtons";
import { useDynamicModal } from "../../components/DynamicModal";

export const BeaconDrawerCard = () => {
  const { isOpen, onClose: closeDrawer, onOpen } = useDisclosure();
  const { isOpen: isDynamicModalOpen } = useDynamicModal();
  return (
    <>
      <SettingsCardWithDrawerIcon left="dApps" onClick={onOpen} isSelected={isOpen} />
      <Drawer
        blockScrollOnMount={!isDynamicModalOpen}
        isOpen={isOpen}
        placement="right"
        onClose={closeDrawer}
        autoFocus={false}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody>
            <DrawerTopButtons onClose={closeDrawer} />
            <BeaconDrawerBody />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const BeaconDrawerBody = () => {
  const addPeer = useAddPeer();
  return (
    <Box>
      <Flex h={24} justifyContent="space-between" alignItems="center">
        <Heading size="xl">dApps</Heading>
      </Flex>
      <Button
        onClick={() =>
          navigator.clipboard.readText().then(text => {
            addPeer(text);
          })
        }
      >
        Paste a peer request code
      </Button>
      <Text mt="16px" mb="32px" color="text.dark">
        or open a deeplink from inside the dApp...
      </Text>
      <BeaconPeers />
    </Box>
  );
};
