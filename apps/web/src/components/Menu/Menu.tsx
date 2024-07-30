import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useSelectNetwork, useSelectedNetwork } from "@umami/state";
import { useRef } from "react";

import { LogoutIcon } from "../../assets/icons";
import { persistor } from "../../utils/persistor";
import { AccountSelectorModal } from "../AccountSelectorModal";

export const Menu = () => {
  const selectNetwork = useSelectNetwork();
  const currentNetwork = useSelectedNetwork();

  const { openWith } = useDynamicModalContext();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  const handleLogout = () => {
    persistor.pause();
    localStorage.removeItem("persist:accounts");
    window.location.replace("/");
  };

  return (
    <>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody paddingTop="40px">
          <Box>
            <RadioGroup onChange={selectNetwork} value={currentNetwork.name}>
              <Heading>Network</Heading>
              <Stack direction="column">
                <Radio value="mainnet">Mainnet</Radio>
                <Radio value="ghostnet">Ghostnet</Radio>
              </Stack>
            </RadioGroup>
          </Box>
          <Box>
            <Flex
              alignItems="center"
              gap="10px"
              padding="20px"
              color="gray.400"
              _hover={{
                bg: "gray.100",
              }}
              cursor="pointer"
              onClick={onOpen}
              rounded="full"
            >
              <LogoutIcon />
              <Text color="gray.900" fontWeight="600" size="lg">
                Logout
              </Text>
            </Flex>
          </Box>
          <button onClick={() => openWith(<AccountSelectorModal />)}>test modal</button>
        </DrawerBody>
      </DrawerContent>
      <AlertDialog
        isCentered
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        motionPreset="slideInBottom"
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Logout</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Before logging out, make sure your mnemonic phrase is securely saved. Losing this phrase
            could result in permanent loss of access to your data.
          </AlertDialogBody>
          <AlertDialogFooter justifyContent="flex-end">
            <Button ref={cancelRef} onClick={onClose} size="lg">
              Cancel
            </Button>
            <Button
              marginLeft={3}
              colorScheme="red"
              onClick={handleLogout}
              size="lg"
              variant="primary"
            >
              Logout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
