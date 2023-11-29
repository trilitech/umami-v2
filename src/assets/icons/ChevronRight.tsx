import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const ChevronRightIcon: React.FC<IconProps> = props => (
  <Icon
    width="18px"
    height="18px"
    fill="none"
    stroke={colors.gray[450]}
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M7 14L11.5 9.5L7 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
  </Icon>
);
export default ChevronRightIcon;
