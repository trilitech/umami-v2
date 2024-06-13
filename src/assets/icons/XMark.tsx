import { Icon, type IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const XMarkIcon: React.FC<IconProps> = props => (
  <Icon
    width="18px"
    height="18px"
    fill="none"
    stroke={colors.gray[450]}
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
      data-testid="xmark-icon-path"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </Icon>
);
