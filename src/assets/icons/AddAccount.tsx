import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

const AddAccountIcon: React.FC<IconProps> = props => {
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
        d="M8.25 13.5H4.65C3.80992 13.5 3.38988 13.5 3.06901 13.3365C2.78677 13.1927 2.5573 12.9632 2.41349 12.681C2.25 12.3601 2.25 11.9401 2.25 11.1V5.4C2.25 4.55992 2.25 4.13988 2.41349 3.81901C2.5573 3.53677 2.78677 3.3073 3.06901 3.16349C3.38988 3 3.80992 3 4.65 3H13.35C14.1901 3 14.6101 3 14.931 3.16349C15.2132 3.3073 15.4427 3.53677 15.5865 3.81901C15.75 4.13988 15.75 4.55992 15.75 5.4V8.25M2.25 6H15.75M13.5 15V10.5M15.75 12.7506L11.25 12.75"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default AddAccountIcon;
