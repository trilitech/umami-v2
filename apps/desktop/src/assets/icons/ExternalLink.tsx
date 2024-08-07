import { Icon, type IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const ExternalLinkIcon = (props: IconProps) => (
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
      d="M15 3L9 9M15 3V6.375M15 3H11.625M14.25 9.375V12.6C14.25 13.4401 14.25 13.8601 14.0865 14.181C13.9427 14.4632 13.7132 14.6927 13.431 14.8365C13.1101 15 12.6901 15 11.85 15H5.4C4.55992 15 4.13988 15 3.81901 14.8365C3.53677 14.6927 3.3073 14.4632 3.16349 14.181C3 13.8601 3 13.4401 3 12.6V6.15C3 5.30992 3 4.88988 3.16349 4.56901C3.3073 4.28677 3.53677 4.0573 3.81901 3.91349C4.13988 3.75 4.55992 3.75 5.4 3.75H8.625"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </Icon>
);
