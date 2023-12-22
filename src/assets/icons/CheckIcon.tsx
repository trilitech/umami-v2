import { Icon, IconProps } from "@chakra-ui/react";

export const CheckIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="15px"
      height="11px"
      fill="none"
      stroke="white"
      viewBox="0 0 15 11"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.16602 5.98371L5.06345 9.85408L13.8327 1.14575"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
