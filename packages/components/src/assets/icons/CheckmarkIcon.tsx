import { Icon, type IconProps } from "@chakra-ui/react";

export const CheckmarkIcon = (props: IconProps) => (
  <Icon
    width="18px"
    height="18px"
    fill="none"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_415_12430)">
      <path
        d="M6 9.25L7.84615 11.25L12 6.75M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C12.7279 2.25 15.75 5.27208 15.75 9Z"
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </g>
    <defs>
      <clipPath id="clip0_415_12430">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </Icon>
);
