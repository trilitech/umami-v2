import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const ThreeDotsIcon: React.FC<IconProps> = props => (
  <Icon
    width="14px"
    height="14px"
    fill={colors.white}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
  </Icon>
);
