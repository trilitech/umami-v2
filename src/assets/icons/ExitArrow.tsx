import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const ExitArrowIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={colors.gray[450]}
      {...props}
    >
      <path
        d="M15 3V15M3 9H12M12 9L9 6M12 9L9 12"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default ExitArrowIcon;
