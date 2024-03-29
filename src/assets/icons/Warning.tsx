import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const WarningIcon: React.FC<IconProps> = props => (
  <Icon
    width="36px"
    height="32px"
    fill="none"
    stroke={colors.orangeL}
    viewBox="0 0 36 32"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18.0004 24.3332H18.0171M18.0004 12.6665V19.3332M8.68719 30.9999H27.3136C30.2831 30.9999 31.7678 30.9999 32.6386 30.3754C33.3985 29.8305 33.8946 28.9915 34.0058 28.0631C34.1333 26.9991 33.4178 25.6982 31.9868 23.0963L22.6736 6.16318C21.1499 3.39292 20.3881 2.00779 19.3814 1.54954C18.5041 1.15015 17.4968 1.15015 16.6194 1.54954C15.6127 2.00779 14.8509 3.39292 13.3273 6.16317L4.01404 23.0963C2.58301 25.6982 1.8675 26.9991 1.99498 28.0631C2.10622 28.9915 2.6023 29.8305 3.36219 30.3754C4.23304 30.9999 5.71776 30.9999 8.68719 30.9999Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </Icon>
);
