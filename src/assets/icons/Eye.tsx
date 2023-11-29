import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const EyeIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="16px"
      height="12px"
      fill="none"
      viewBox="0 0 16 12"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.2501 6C10.2501 7.24264 9.2427 8.25 8.00006 8.25C6.75742 8.25 5.75006 7.24264 5.75006 6C5.75006 4.75736 6.75742 3.75 8.00006 3.75C9.2427 3.75 10.2501 4.75736 10.2501 6Z"
        stroke={colors.gray[450]}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
      <path
        d="M8.00039 0.75C4.64217 0.75 1.79946 2.95716 0.84375 5.99997C1.79944 9.04282 4.64217 11.25 8.00041 11.25C11.3586 11.25 14.2013 9.04284 15.157 6.00003C14.2014 2.95719 11.3586 0.75 8.00039 0.75Z"
        stroke={colors.gray[450]}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
