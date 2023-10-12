import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const PlusIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.gray[300]}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 12H20M12 4V20" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
};

export default PlusIcon;
