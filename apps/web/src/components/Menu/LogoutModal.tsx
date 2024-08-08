import {
  Button,
  Center,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { logout } from "@umami/state";

import { useColor } from "../../styles/useColor";
import { persistor } from "../../utils/persistor";
import { ModalCloseButton } from "../CloseButton";

export const LogoutModal = () => {
  const color = useColor();

  return (
    <ModalContent>
      <ModalHeader>
        <Heading size="xl">Logout</Heading>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <Center>
          <Text
            width="full"
            maxWidth="340px"
            color={color("700")}
            fontWeight="400"
            textAlign="center"
            size="md"
          >
            Before logging out, make sure your mnemonic phrase is securely saved. Losing this phrase
            could result in permanent loss of access to your data.
          </Text>
        </Center>
      </ModalBody>
      <ModalFooter>
        <Button width="full" onClick={() => logout(persistor)} size="lg" variant="alert">
          Logout
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
