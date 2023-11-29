import { Icon, IconProps } from "@chakra-ui/react";

export const AddContactIcon: React.FC<IconProps> = props => {
  return (
    <Icon fill="none" viewBox="0 0 13 17" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M13 12.5L10.75 12.5M10.75 12.5L8.5 12.5M10.75 12.5V10.25M10.75 12.5V14.75M6.25 14.75H1C1 11.8505 3.35051 9.5 6.25 9.5C6.77123 9.5 7.27472 9.57596 7.75 9.71741M9.25 4.25C9.25 5.90685 7.90685 7.25 6.25 7.25C4.59315 7.25 3.25 5.90685 3.25 4.25C3.25 2.59315 4.59315 1.25 6.25 1.25C7.90685 1.25 9.25 2.59315 9.25 4.25Z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
