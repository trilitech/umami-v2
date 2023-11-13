import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const RotateIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      data-testid="rotate-icon"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={colors.gray[450]}
      {...props}
    >
      <path
        d="M12.5 18.5C17.1944 18.5 21 14.6944 21 10C21 5.30558 17.1944 1.5 12.5 1.5C7.80558 1.5 4 5.30558 4 10C4 11.5433 4.41128 12.9905 5.13022 14.238M1.5 13L5.13022 14.238M6.82531 10.3832L5.47107 14.3542L5.13022 14.238"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default RotateIcon;
