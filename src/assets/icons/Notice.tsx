import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const NoticeIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="24px"
      height="24px"
      fill="none"
      stroke={colors.gray[450]}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 8H12.01M12 11V16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
