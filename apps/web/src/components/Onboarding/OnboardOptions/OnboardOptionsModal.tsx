import { ModalBody, ModalContent, ModalHeader } from "@chakra-ui/react";

import { OnboardOptions } from "./OnboardOptions";
import { ModalBackButton } from "../../BackButton";
import { ModalCloseButton } from "../../CloseButton";

export const OnboardOptionsModal = () => (
  <ModalContent>
    <ModalHeader margin="0">
      <ModalBackButton />
      <ModalCloseButton />
    </ModalHeader>
    <ModalBody>
      <OnboardOptions />
    </ModalBody>
  </ModalContent>
);
