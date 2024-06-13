import { Icon, type IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const LedgerIcon: React.FC<IconProps> = props => (
  <Icon
    width="18px"
    height="18px"
    fill={colors.gray[400]}
    data-testid="ledger-icon"
    strokeWidth="0"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M11.666 7.29183H12.3952V8.75016H9.47852V4.37516H10.9368L8.74935 1.4585L6.56185 4.37516H8.02018V10.2085H5.10352V8.54818C5.5381 8.29516 5.83268 7.82995 5.83268 7.29183C5.83268 6.90506 5.67904 6.53412 5.40555 6.26063C5.13206 5.98714 4.76112 5.8335 4.37435 5.8335C3.98757 5.8335 3.61664 5.98714 3.34315 6.26063C3.06966 6.53412 2.91602 6.90506 2.91602 7.29183C2.91602 7.82995 3.2106 8.29516 3.64518 8.54818V10.2085C3.64518 11.0128 4.29924 11.6668 5.10352 11.6668H8.02018V13.3271C7.79896 13.454 7.61508 13.6369 7.48707 13.8575C7.35906 14.0781 7.29143 14.3285 7.29102 14.5835C7.29102 14.9703 7.44466 15.3412 7.71815 15.6147C7.99164 15.8882 8.36257 16.0418 8.74935 16.0418C9.13612 16.0418 9.50706 15.8882 9.78055 15.6147C10.054 15.3412 10.2077 14.9703 10.2077 14.5835C10.2077 14.0454 9.9131 13.5802 9.47852 13.3271V10.2085H12.3952C13.1995 10.2085 13.8535 9.55443 13.8535 8.75016V7.29183H14.5827V4.37516H11.666V7.29183Z" />
  </Icon>
);
