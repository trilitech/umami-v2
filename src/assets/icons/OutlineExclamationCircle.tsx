import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const OutlineExclamationCircleIcon: React.FC<IconProps> = props => (
  <Icon
    width="16px"
    height="16px"
    fill="none"
    stroke={colors.gray[450]}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 5V8.75M8 11H8.0075M14.75 8C14.75 11.7279 11.7279 14.75 8 14.75C4.27208 14.75 1.25 11.7279 1.25 8C1.25 4.27208 4.27208 1.25 8 1.25C11.7279 1.25 14.75 4.27208 14.75 8Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </Icon>
);
