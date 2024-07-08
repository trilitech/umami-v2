import { Icon, type IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const ChevronDownIcon = (props: IconProps) => (
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
      d="M4.5 6.75L9 11.25L13.5 6.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </Icon>
);
