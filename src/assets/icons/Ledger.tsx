import { Icon, IconProps } from "@chakra-ui/react";

import { MdUsb } from "react-icons/md";
const LedgerIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      as={MdUsb}
      data-testid="ledger-icon"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    />
  );
};

export default LedgerIcon;
