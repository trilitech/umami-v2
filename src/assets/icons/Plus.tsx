import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const PlusIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="24px"
      height="24px"
      fill="none"
      stroke={colors.gray[300]}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 12H20M12 4V20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
    </Icon>
  );
};
