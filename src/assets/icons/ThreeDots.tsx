import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const ThreeDotsIcon: React.FC<IconProps> = props => (
  <Icon
    width="18px"
    height="18px"
    fill="none"
    stroke={colors.gray[300]}
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.5 9H13.5075M9 9H9.0075M4.5 9H4.5075M9.75 9C9.75 9.41421 9.41421 9.75 9 9.75C8.58579 9.75 8.25 9.41421 8.25 9C8.25 8.58579 8.58579 8.25 9 8.25C9.41421 8.25 9.75 8.58579 9.75 9ZM14.25 9C14.25 9.41421 13.9142 9.75 13.5 9.75C13.0858 9.75 12.75 9.41421 12.75 9C12.75 8.58579 13.0858 8.25 13.5 8.25C13.9142 8.25 14.25 8.58579 14.25 9ZM5.25 9C5.25 9.41421 4.91421 9.75 4.5 9.75C4.08579 9.75 3.75 9.41421 3.75 9C3.75 8.58579 4.08579 8.25 4.5 8.25C4.91421 8.25 5.25 8.58579 5.25 9Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Icon>
);
