import { Icon, type IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const TrashIcon = (props: IconProps) => (
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
      d="M3 4.5H15M12 4.5L11.797 3.89105C11.6003 3.30094 11.502 3.00588 11.3195 2.78774C11.1584 2.5951 10.9516 2.44599 10.7179 2.35408C10.4532 2.25 10.1422 2.25 9.52018 2.25H8.47982C7.85779 2.25 7.54677 2.25 7.28213 2.35408C7.04844 2.44599 6.84156 2.5951 6.68047 2.78774C6.49804 3.00588 6.39969 3.30094 6.20298 3.89105L6 4.5M13.5 4.5V12.15C13.5 13.4101 13.5 14.0402 13.2548 14.5215C13.039 14.9448 12.6948 15.289 12.2715 15.5048C11.7902 15.75 11.1601 15.75 9.9 15.75H8.1C6.83988 15.75 6.20982 15.75 5.72852 15.5048C5.30516 15.289 4.96095 14.9448 4.74524 14.5215C4.5 14.0402 4.5 13.4101 4.5 12.15V4.5M10.5 7.5V12.75M7.5 7.5V12.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </Icon>
);
