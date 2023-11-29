import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const RefreshClockIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 9C3 12.3137 5.68629 15 9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3C7.20796 3 5.59942 3.78563 4.5 5.03126C4.43696 5.10268 4.3756 5.17562 4.31597 5.25M9 6V9L10.875 10.875M4.31543 3.00293V5.25293H6.56543"
        stroke={colors.gray[450]}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
