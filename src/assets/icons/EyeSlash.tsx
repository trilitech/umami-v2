import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const EyeSlashIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.25024 2.25L15.7502 15.75M7.38345 7.43523C6.99147 7.84016 6.75024 8.39191 6.75024 9C6.75024 10.2426 7.7576 11.25 9.00024 11.25C9.6171 11.25 10.176 11.0018 10.5824 10.5997M4.87524 4.98536C3.45076 5.92525 2.36577 7.33796 1.84375 8.99997C2.79944 12.0428 5.64217 14.25 9.00041 14.25C10.4921 14.25 11.882 13.8145 13.0501 13.0638M8.25024 3.78705C8.49697 3.76254 8.74722 3.75 9.00039 3.75C12.3586 3.75 15.2014 5.95719 16.157 9.00003C15.9465 9.67048 15.6443 10.3004 15.2651 10.875"
        stroke={colors.gray[450]}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default EyeSlashIcon;
