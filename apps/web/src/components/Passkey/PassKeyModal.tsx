import {
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Input,
  ModalBody,
  ModalContent,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import hj from "@hotjar/browser";
import { useState } from "react";
import { Passkey } from "@umami/passkey";

import { PasskeyIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ModalCloseButton } from "../CloseButton";


export const PasskeyModal = () => {
  const color = useColor();
  hj.stateChange("passkey");

  return (
    <ModalContent>
      <ModalHeader>
        <ModalCloseButton />
        <Center flexDirection="row" gap="16px">
          <Icon as={PasskeyIcon} width="24px" height="24px" color={color("400")} />
          <Heading size="xl">Passkey</Heading>
        </Center>
      </ModalHeader>

      <ModalBody>
      <Passkey />
      </ModalBody>
    </ModalContent>
  );
};
