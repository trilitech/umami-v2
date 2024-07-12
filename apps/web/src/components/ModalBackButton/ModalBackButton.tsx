import { type ButtonProps, IconButton } from "@chakra-ui/react";

import { ArrowLeftCircleIcon } from "../../assets/icons";

type ModalBackButtonProps = {
  onClick: () => void;
} & ButtonProps;

export const ModalBackButton = ({ onClick, ...props }: ModalBackButtonProps) => (
  <IconButton
    position="absolute"
    top={{ base: "12px", lg: "18px" }}
    left={{ base: "12px", lg: "18px" }}
    width="24px"
    color="gray.400"
    aria-label="Back"
    icon={<ArrowLeftCircleIcon />}
    onClick={onClick}
    variant="empty"
    {...props}
  />
);
