import { Icon, IconProps } from "@chakra-ui/react";

export const MaintenanceIcon: React.FC<IconProps> = props => (
  <Icon
    width="18px"
    height="18px"
    fill="none"
    stroke="black"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.182 5.81859C13.9393 7.57595 13.9393 10.4252 12.182 12.1825M5.81802 12.1825C4.06066 10.4252 4.06066 7.57592 5.81802 5.81856M3.6967 14.3039C0.767767 11.3749 0.767767 6.6262 3.6967 3.69727M14.3033 3.6973C17.2322 6.62623 17.2322 11.375 14.3033 14.3039M10.5 9.00057C10.5 9.82899 9.82843 10.5006 9 10.5006C8.17157 10.5006 7.5 9.82899 7.5 9.00057C7.5 8.17214 8.17157 7.50057 9 7.50057C9.82843 7.50057 10.5 8.17214 10.5 9.00057Z"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </Icon>
);
