import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const HelpIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18.3795 5.65166L14.1055 9.86303M9.89445 14.137L5.63994 18.3679M5.63408 5.63799L9.89445 9.86303M14.1056 14.137L18.364 18.364M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
        stroke={colors.gray[450]}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};
export default HelpIcon;
