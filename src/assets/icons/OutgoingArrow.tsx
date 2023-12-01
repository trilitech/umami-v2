import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const OutgoingArrow: React.FC<IconProps> = props => {
  return (
    <Icon
      width="18px"
      height="18px"
      fill="none"
      stroke={colors.gray[450]}
      data-testid="outgoing-arrow-icon"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.25 12.75L12.75 5.25M12.75 5.25H6M12.75 5.25V12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
