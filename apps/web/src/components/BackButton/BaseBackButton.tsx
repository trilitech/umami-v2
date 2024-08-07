import { IconButton, type IconButtonProps } from "@chakra-ui/react";

import { ArrowLeftCircleIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const BaseBackButton = (props: Omit<IconButtonProps, "aria-label">) => {
  const color = useColor();

  return (
    <IconButton
      position="absolute"
      top={{
        base: "12px",
        lg: "18px",
      }}
      left={{
        base: "12px",
        lg: "18px",
      }}
      padding="0"
      color={color("400")}
      aria-label="Go back"
      icon={<ArrowLeftCircleIcon width="24px" height="24px" />}
      size="sm"
      variant="ghost"
      {...props}
    />
  );
};
