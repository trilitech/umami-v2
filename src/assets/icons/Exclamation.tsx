import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

export const ExclamationIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="12px"
      height="12px"
      fill="none"
      stroke={colors.orange}
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 3.66667V6.58333M6 8.33333H6.00583M11.25 6C11.25 8.89949 8.89949 11.25 6 11.25C3.1005 11.25 0.75 8.89949 0.75 6C0.75 3.1005 3.1005 0.75 6 0.75C8.89949 0.75 11.25 3.1005 11.25 6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
