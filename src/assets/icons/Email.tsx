import { Icon, IconProps } from "@chakra-ui/react";

export const EmailIcon: React.FC<IconProps> = props => (
  <Icon
    width="28px"
    height="28px"
    fill="black"
    data-testid="email-icon"
    viewBox="0 0 28 28"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M23.332 4.66602H4.66536C3.38203 4.66602 2.3437 5.71602 2.3437 6.99935L2.33203 20.9993C2.33203
    22.2827 3.38203 23.3327 4.66536 23.3327H23.332C24.6154 23.3327 25.6654 22.2827 25.6654
    20.9993V6.99935C25.6654 5.71602 24.6154 4.66602 23.332 4.66602ZM23.332 9.33268L13.9987
    15.166L4.66536 9.33268V6.99935L13.9987 12.8327L23.332 6.99935V9.33268Z"
    />
  </Icon>
);
