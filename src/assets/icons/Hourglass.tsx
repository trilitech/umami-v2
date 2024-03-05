import { Icon, IconProps } from "@chakra-ui/react";

export const HourglassIcon: React.FC<IconProps> = props => (
  <Icon
    width="18px"
    height="18px"
    fill="none"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15 2.25H3M15 15.75H3M3.75 2.25C3.75 4.13267 4.65921 5.89944 6.1912 6.99371L11.8088 11.0063C13.3408 12.1006 14.25 13.8673 14.25 15.75M14.25 2.25C14.25 4.13267 13.3408 5.89944 11.8088 6.99371L6.1912 11.0063C4.65921 12.1006 3.75 13.8673 3.75 15.75"
      stroke="#FB4F57"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </Icon>
);
