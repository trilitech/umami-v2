import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const ContractIcon: React.FC<IconProps> = props => (
  <Icon
    width="18px"
    height="18px"
    fill="none"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.5 12.75L6 11.25L7.5 9.75M10.5 9.75L12 11.25L10.5 12.75M9.75 2.25H6.15C5.30992 2.25 4.88988 2.25 4.56901 2.41349C4.28677 2.5573 4.0573 2.78677 3.91349 3.06901C3.75 3.38988 3.75 3.80992 3.75 4.65V13.35C3.75 14.1901 3.75 14.6101 3.91349 14.931C4.0573 15.2132 4.28677 15.4427 4.56901 15.5865C4.88988 15.75 5.30992 15.75 6.15 15.75H11.85C12.6901 15.75 13.1101 15.75 13.431 15.5865C13.7132 15.4427 13.9427 15.2132 14.0865 14.931C14.25 14.6101 14.25 14.1901 14.25 13.35V6.75M9.75 2.25L14.25 6.75M9.75 2.25V6C9.75 6.41421 10.0858 6.75 10.5 6.75H14.25"
      stroke={colors.gray[450]}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </Icon>
);
