import { IconProps } from "@chakra-ui/react";

import { IncomingArrow, OutgoingArrow } from "../../assets/icons";

export const TransactionDirectionIcon = ({
  isOutgoing,
  ...props
}: { isOutgoing: boolean } & IconProps) => {
  return isOutgoing ? (
    <OutgoingArrow data-testid="outgoing-arrow" {...props} />
  ) : (
    <IncomingArrow data-testid="incoming-arrow" {...props} />
  );
};
