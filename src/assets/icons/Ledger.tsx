import { Icon, IconProps } from "@chakra-ui/react";
import { MdUsb } from "react-icons/md";

export const LedgerIcon: React.FC<IconProps> = props => (
  <Icon
    as={MdUsb}
    width="18px"
    height="18px"
    data-testid="ledger-icon"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  />
);
