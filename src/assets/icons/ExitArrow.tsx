import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const ExitArrowIcon: React.FC<IconProps> = props => {
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
        d="M15 3V15M3 9H12M12 9L9 6M12 9L9 12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
