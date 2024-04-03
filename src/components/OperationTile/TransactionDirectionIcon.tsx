import { IconProps } from "@chakra-ui/react";

import { OperationDestination } from "./useGetOperationDestination";
import { ContractIcon, IncomingArrow, OutgoingArrow } from "../../assets/icons";

export const TransactionDirectionIcon = ({
  destination,
  ...props
}: { destination: OperationDestination } & IconProps) =>
  destination === "outgoing" ? (
    <OutgoingArrow data-testid="outgoing-arrow" {...props} />
  ) : destination === "incoming" ? (
    <IncomingArrow data-testid="incoming-arrow" {...props} />
  ) : (
    <ContractIcon data-testid="unrelated-operation-icon" {...props} />
  );
