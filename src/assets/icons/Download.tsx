import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const DownloadIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="16px"
      height="16px"
      fill="none"
      stroke={colors.gray[450]}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 7.25L8 10.25M8 10.25L11 7.25M8 10.25V1.25M14.75 7.25V12.3494C14.75 13.1895 14.75 13.6095 14.5865 13.9304C14.4427 14.2126 14.2132 14.4421 13.931 14.5859C13.6101 14.7494 13.1901 14.7494 12.35 14.7494H3.65C2.80992 14.7494 2.38988 14.7494 2.06901 14.5859C1.78677 14.4421 1.5573 14.2126 1.41349 13.9304C1.25 13.6095 1.25 13.1895 1.25 12.3494V7.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};

export default DownloadIcon;
