import { ModalCloseButton, type ModalCloseButtonProps } from "@chakra-ui/react";

import { CloseIcon } from "../../assets/icons";

export const CloseButton = ({ ...props }: ModalCloseButtonProps) => (
  <ModalCloseButton
    top={{ base: "12px", lg: "18px" }}
    right={{ base: "12px", lg: "18px" }}
    width="24px"
    color="gray.400"
    {...props}
  >
    <CloseIcon />
  </ModalCloseButton>
);
