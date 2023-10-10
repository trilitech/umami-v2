import { Icon, IconProps } from "@chakra-ui/react";

const UnknownContactIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      data-testid="unknown-contact-icon"
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.16602 15.5625C3.16602 12.7435 5.45123 10.4583 8.27018 10.4583C8.51775 10.4583 8.7612 10.476 8.99935 10.51M13.3722 13.375C14.1014 12.6458 14.8305 12.3575 14.8305 11.5521C14.8305 10.7467 14.1776 10.0938 13.3722 10.0938C12.6927 10.0938 12.1217 10.5585 11.9598 11.1875M13.3722 15.5625H13.3795M11.1868 5.35417C11.1868 6.965 9.88101 8.27083 8.27018 8.27083C6.65935 8.27083 5.35352 6.965 5.35352 5.35417C5.35352 3.74334 6.65935 2.4375 8.27018 2.4375C9.88101 2.4375 11.1868 3.74334 11.1868 5.35417Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default UnknownContactIcon;
