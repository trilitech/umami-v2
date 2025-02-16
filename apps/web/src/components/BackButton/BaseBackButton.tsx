import { IconButton, type IconButtonProps } from "@chakra-ui/react";

import { ArrowLeftCircleIcon } from "../../assets/icons";

export const BaseBackButton = (props: Omit<IconButtonProps, "aria-label">) => (
  <IconButton
    position="absolute"
    zIndex="2"
    top={{
      base: "12px",
      md: "18px",
    }}
    left={{
      base: "7px",
      md: "13px",
    }}
    padding="0"
    aria-label="Go back"
    icon={<ArrowLeftCircleIcon width="24px" height="24px" />}
    size="sm"
    variant="iconButton"
    {...props}
  />
);
