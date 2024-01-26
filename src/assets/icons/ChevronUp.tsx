import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const ChevronUpIcon: React.FC<IconProps> = props => (
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
      d="M4.5 11.25L9 6.75L13.5 11.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </Icon>
);
