import {
  ModalCloseButton as ChakraModalCloseButton,
  type ModalCloseButtonProps as ChakraModalCloseButtonProps,
} from "@chakra-ui/react";

import { CloseIcon } from "../../assets/icons";

type ModalCloseButtonProps = {
  onClose?: () => void;
} & ChakraModalCloseButtonProps;

export const ModalCloseButton = ({ onClose, ...props }: ModalCloseButtonProps) => (
  <ChakraModalCloseButton
    top={{ base: "12px", lg: "18px" }}
    right={{ base: "12px", lg: "18px" }}
    width="24px"
    color="gray.400"
    onClick={onClose}
    {...props}
  >
    <CloseIcon />
  </ChakraModalCloseButton>
);
