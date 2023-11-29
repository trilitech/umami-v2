import { Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const LinkIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="24px"
      height="24px"
      fill="none"
      stroke={colors.gray[450]}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.16586 17.6508C8.9261 17.8747 8.74055 18.0245 8.55093 18.134C7.62273 18.6699 6.47914 18.6699 5.55093 18.134C5.20889 17.9365 4.88009 17.6077 4.22251 16.9501C3.56492 16.2925 3.23612 15.9637 3.03864 15.6217C2.50274 14.6935 2.50274 13.5499 3.03864 12.6217C3.23612 12.2797 3.56492 11.9509 4.2225 11.2933L7.05093 8.46484C7.70852 7.80725 8.03732 7.47846 8.37936 7.28098C9.30756 6.74508 10.4512 6.74508 11.3794 7.28098C11.7214 7.47846 12.0502 7.80725 12.7078 8.46484C13.3654 9.12243 13.6942 9.45123 13.8916 9.79327C14.4275 10.7215 14.4275 11.8651 13.8916 12.7933C13.7822 12.9829 13.6323 13.1684 13.4085 13.4082M10.5929 10.5926C10.369 10.8323 10.2192 11.0179 10.1097 11.2075C9.57381 12.1357 9.57381 13.2793 10.1097 14.2075C10.3072 14.5495 10.636 14.8783 11.2936 15.5359C11.9512 16.1935 12.28 16.5223 12.622 16.7198C13.5502 17.2557 14.6938 17.2557 15.622 16.7198C15.964 16.5223 16.2928 16.1935 16.9504 15.5359L19.7789 12.7075C20.4364 12.0499 20.7652 11.7211 20.9627 11.3791C21.4986 10.4509 21.4986 9.30726 20.9627 8.37906C20.7652 8.03701 20.4364 7.70822 19.7789 7.05063C19.1213 6.39304 18.7925 6.06425 18.4504 5.86677C17.5222 5.33087 16.3786 5.33087 15.4504 5.86677C15.2608 5.97625 15.0753 6.12608 14.8355 6.34992"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};
