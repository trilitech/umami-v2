import {
  Button,
  Heading,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useColor } from "../../styles/useColor";
import { persistor } from "../../utils/persistor";
import { ModalCloseButton } from "../ModalCloseButton";

export const LogoutModal = () => {
  const color = useColor();
  const handleLogout = () => {
    persistor.pause();
    localStorage.removeItem("persist:accounts");
    window.location.replace("/");
  };

  return (
    <ModalContent>
      <ModalHeader>
        <VStack gap="12px">
          <Heading size="md">Logout</Heading>
          <Text maxWidth="340px" color={color("700")} fontWeight="400" size="md">
            Before logging out, make sure your mnemonic phrase is securely saved. Losing this phrase
            could result in permanent loss of access to your data.
          </Text>
        </VStack>
        <ModalCloseButton />
      </ModalHeader>
      <ModalFooter>
        <Button width="full" onClick={handleLogout} size="lg" variant="alert">
          Logout
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
