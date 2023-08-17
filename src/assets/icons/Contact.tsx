import { Icon, IconProps } from "@chakra-ui/react";

const ContactIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      data-testid="contact-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.75 15.75C3.75 12.8505 6.10051 10.5 9 10.5C11.8995 10.5 14.25 12.8505 14.25 15.75M12 5.25C12 6.90685 10.6569 8.25 9 8.25C7.34315 8.25 6 6.90685 6 5.25C6 3.59315 7.34315 2.25 9 2.25C10.6569 2.25 12 3.59315 12 5.25Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default ContactIcon;
