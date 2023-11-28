import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const PenIcon: React.FC<IconProps> = props => {
  return (
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
        d="M11.3348 4.66483L13.2208 6.55082M3 15L3.03164 14.7785C3.1436 13.9948 3.19958 13.6029 3.32692 13.2371C3.43992 12.9124 3.59428 12.6037 3.78619 12.3185C4.00247 11.9971 4.28237 11.7172 4.84218 11.1574L12.609 3.3906C13.1298 2.8698 13.9742 2.8698 14.495 3.3906C15.0158 3.9114 15.0158 4.75578 14.495 5.27658L6.58565 13.1859C6.07779 13.6938 5.82386 13.9477 5.53462 14.1497C5.27789 14.3289 5.001 14.4774 4.70965 14.5921C4.3814 14.7213 4.02937 14.7923 3.32535 14.9344L3 15Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default PenIcon;
