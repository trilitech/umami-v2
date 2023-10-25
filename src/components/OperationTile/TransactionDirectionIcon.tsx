import { IconProps } from "@chakra-ui/react";
import OutgoingArrow from "../../assets/icons/OutgoingArrow";
import IncomingArrow from "../../assets/icons/IncomingArrow";

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
