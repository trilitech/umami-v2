import { ModalBody, ModalContent, ModalHeader } from "@chakra-ui/react";
import hj from "@hotjar/browser";

import { OnboardOptions } from "./OnboardOptions";
import { ModalBackButton } from "../../BackButton";
import { ModalCloseButton } from "../../CloseButton";

export const OnboardOptionsModal = () => {
  hj.stateChange("menu/onboardOptionsModal");

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
