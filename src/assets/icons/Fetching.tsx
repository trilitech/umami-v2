import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

export const FetchingIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="19px"
      height="19px"
      fill="none"
      stroke={colors.gray[400]}
      viewBox="0 0 19 19"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.7842 10.2916C15.8165 10.0323 15.8332 9.76807 15.8332 9.49996C15.8332 6.00216 12.9976 3.16663 9.49984 3.16663C7.52021 3.16663 5.75273 4.07488 4.59135 5.49742M3.2155 8.70829C3.18316 8.96764 3.1665 9.23185 3.1665 9.49996C3.1665 12.9978 6.00203 15.8333 9.49984 15.8333C11.3914 15.8333 13.0893 15.004 14.2498 13.6892M11.8748 13.4583H14.2498V13.6892M4.59135 3.16663V5.49742M4.59135 5.49742V5.54157L6.96635 5.54163M14.2498 15.8333V13.6892"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
