import { IconButton, type IconButtonProps } from "@chakra-ui/react";

import { ArrowLeftCircleIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const ModalBackButton = (props: IconButtonProps) => {
  const color = useColor();
  return <IconButton color={color("400")} icon={<ArrowLeftCircleIcon />} {...props} />;
};
