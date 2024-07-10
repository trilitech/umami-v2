import { Icon, type IconProps } from "@chakra-ui/react";
import { type OperationDestination } from "@umami/core";

import { ContractIcon, IncomingArrowIcon, OutgoingArrowIcon } from "../../assets/icons";

export const TransactionDirectionIcon = ({
  destination,
  ...props
}: { destination: OperationDestination } & IconProps) =>
  destination === "outgoing" ? (
    <Icon as={OutgoingArrowIcon} data-testid="outgoing-arrow" {...props} />
  ) : destination === "incoming" ? (
    <Icon as={IncomingArrowIcon} data-testid="incoming-arrow" {...props} />
  ) : (
    <Icon as={ContractIcon} data-testid="unrelated-operation-icon" {...props} />
  );
