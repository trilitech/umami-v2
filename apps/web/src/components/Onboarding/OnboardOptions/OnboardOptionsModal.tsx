import { ModalBody, ModalContent, ModalHeader } from "@chakra-ui/react";
import Hotjar from "@hotjar/browser";

import { OnboardOptions } from "./OnboardOptions";
import { ModalBackButton } from "../../BackButton";
import { ModalCloseButton } from "../../CloseButton";

export const OnboardOptionsModal = () => {

  Hotjar.stateChange("account/onboardOptionsModal");

  return (
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
};
