import { IconButton, type IconButtonProps } from "@chakra-ui/react";

import { ArrowLeftCircleIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const BaseBackButton = (props: Omit<IconButtonProps, "aria-label">) => {
  const color = useColor();

  return (
    <IconButton
      position="absolute"
      top="18px"
      left="18px"
      color={color("400")}
      aria-label="Go back"
      icon={<ArrowLeftCircleIcon />}
      variant="ghost"
      {...props}
    />
  );
};
