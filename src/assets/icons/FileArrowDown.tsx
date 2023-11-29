import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const FileArrowDownIcon: React.FC<IconProps> = props => {
  return (
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
        d="M9 8.25V12.75M9 12.75L7.5 11.25M9 12.75L10.5 11.25M9.75 2.25H6.15C5.30992 2.25 4.88988 2.25 4.56901 2.41349C4.28677 2.5573 4.0573 2.78677 3.91349 3.06901C3.75 3.38988 3.75 3.80992 3.75 4.65V13.35C3.75 14.1901 3.75 14.6101 3.91349 14.931C4.0573 15.2132 4.28677 15.4427 4.56901 15.5865C4.88988 15.75 5.30992 15.75 6.15 15.75H11.85C12.6901 15.75 13.1101 15.75 13.431 15.5865C13.7132 15.4427 13.9427 15.2132 14.0865 14.931C14.25 14.6101 14.25 14.1901 14.25 13.35V6.75M9.75 2.25L14.25 6.75M9.75 2.25V5.55C9.75 5.97004 9.75 6.18006 9.83175 6.34049C9.90365 6.48161 10.0184 6.59635 10.1595 6.66825C10.3199 6.75 10.53 6.75 10.95 6.75H14.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
