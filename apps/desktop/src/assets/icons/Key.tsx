import { Icon, type IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const KeyIcon = (props: IconProps) => (
  <Icon
    width="18px"
    height="18px"
    fill="none"
    stroke={colors.gray[450]}
    data-testid="key-icon"
    strokeWidth="1.2"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.24092 8.01389L3 14.25L4.5 15.75M5.25 12L6.75 13.5M15 5.625C15 7.48896 13.489 9 11.625 9C9.76104 9 8.25 7.48896 8.25 5.625C8.25 3.76104 9.76104 2.25 11.625 2.25C13.489 2.25 15 3.76104 15 5.625Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
