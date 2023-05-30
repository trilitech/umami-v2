import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { SettingsCardWithDrawerIcon } from "../../components/ClickableCard";
import { useAddPeer } from "../../utils/beacon/beacon";
import BeaconPeers from "../../utils/beacon/BeaconPeers";
import { DrawerTopButtons } from "../home/DrawerTopButtons";

export const BeaconDrawerCard = () => {
  const { isOpen, onClose: closeDrawer, onOpen } = useDisclosure();

  return (
    <>
      <SettingsCardWithDrawerIcon left="dApps" onClick={onOpen} />
      <Drawer isOpen={isOpen} placement="right" onClose={closeDrawer} size="md">
        <DrawerOverlay />
        <DrawerContent bg="umami.gray.900">
          <DrawerTopButtons
            onPrevious={() => {}}
            onNext={() => {}}
            onClose={closeDrawer}
          />
          <DrawerBody>
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
          navigator.clipboard.readText().then((text) => {
            addPeer(text);
          })
        }
        bg="umami.blue"
        type="submit"
      >
        Connect with Pairing Request
      </Button>
      <BeaconPeers />
    </Box>
  );
};
