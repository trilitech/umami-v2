import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const WindowLinkIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="14px"
      height="14px"
      fill="none"
      stroke={colors.gray[450]}
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13 1L7 7M13 1V4.375M13 1H9.625M12.25 7.375V10.6C12.25 11.4401 12.25 11.8601 12.0865 12.181C11.9427 12.4632 11.7132 12.6927 11.431 12.8365C11.1101 13 10.6901 13 9.85 13H3.4C2.55992 13 2.13988 13 1.81901 12.8365C1.53677 12.6927 1.3073 12.4632 1.16349 12.181C1 11.8601 1 11.4401 1 10.6V4.15C1 3.30992 1 2.88988 1.16349 2.56901C1.3073 2.28677 1.53677 2.0573 1.81901 1.91349C2.13988 1.75 2.55992 1.75 3.4 1.75H6.625"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
