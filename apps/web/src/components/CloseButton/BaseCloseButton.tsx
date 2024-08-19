import { IconButton, type IconButtonProps } from "@chakra-ui/react";

import { CloseIcon } from "../../assets/icons";

export const BaseCloseButton = (props: Omit<IconButtonProps, "aria-label">) => (
  <IconButton
    position="absolute"
    top={{
      base: "12px",
      lg: "18px",
    }}
    right={{
      base: "12px",
      lg: "18px",
    }}
    padding="0"
    icon={<CloseIcon width="24px" height="24px" />}
    size="sm"
    variant="iconButton"
    {...props}
    aria-label="Close"
  />
);
