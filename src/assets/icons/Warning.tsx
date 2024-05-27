import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const WarningIcon: React.FC<IconProps> = props => (
  <Icon
    width="40px"
    height="40px"
    fill="none"
    stroke={colors.orange}
    strokeWidth="2"
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20.0004 28.3332H20.0171M20.0004 16.6665V23.3332M10.6872 34.9999H29.3136C32.2831 34.9999 33.7678 34.9999 34.6386 34.3754C35.3985 33.8305 35.8946 32.9915 36.0058 32.0631C36.1333 30.9991 35.4178 29.6982 33.9868 27.0963L24.6736 10.1632C23.1499 7.39292 22.3881 6.00779 21.3814 5.54954C20.5041 5.15015 19.4968 5.15015 18.6194 5.54954C17.6127 6.00779 16.8509 7.39292 15.3273 10.1632L6.01404 27.0963C4.58301 29.6982 3.8675 30.9991 3.99498 32.0631C4.10622 32.9915 4.6023 33.8305 5.36219 34.3754C6.23304 34.9999 7.71776 34.9999 10.6872 34.9999Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
