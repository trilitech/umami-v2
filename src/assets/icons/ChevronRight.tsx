import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const ChevronRightIcon: React.FC<IconProps> = props => (
  <Icon
    width="18px"
    height="18px"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke={colors.gray[450]}
    {...props}
  >
    <path d="M7 14L11.5 9.5L7 5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </Icon>
);
export default ChevronRightIcon;
