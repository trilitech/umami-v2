import { Icon, type IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const DoubleCheckmarkIcon: React.FC<IconProps> = props => (
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
      d="M4 14L9 19L20 8M6 8.88889L9.07692 12L16 5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </Icon>
);
