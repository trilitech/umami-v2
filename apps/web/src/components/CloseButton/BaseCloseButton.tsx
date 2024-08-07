import { IconButton, type IconButtonProps } from "@chakra-ui/react";

import { CloseIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const BaseCloseButton = (props: Omit<IconButtonProps, "aria-label">) => {
  const color = useColor();

  return (
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
      color={color("400")}
      icon={<CloseIcon width="24px" height="24px" />}
      size="sm"
      variant="ghost"
      {...props}
      aria-label="Close"
    />
  );
};
