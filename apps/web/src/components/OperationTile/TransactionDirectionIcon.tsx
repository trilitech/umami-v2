import { Icon, type IconProps } from "@chakra-ui/react";
import { type OperationDestination } from "@umami/core";
import { memo } from "react";

import { ContractIcon, IncomingArrowIcon, OutgoingArrowIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const TransactionDirectionIcon = memo(
  ({ destination, ...props }: { destination: OperationDestination } & IconProps) => {
    const color = useColor();

    const commonProps = {
      width: "22px",
      height: "22px",
      color: color("400"),
    };

    return destination === "outgoing" ? (
      <Icon as={OutgoingArrowIcon} data-testid="outgoing-arrow" {...commonProps} {...props} />
    ) : destination === "incoming" ? (
      <Icon as={IncomingArrowIcon} data-testid="incoming-arrow" {...commonProps} {...props} />
    ) : (
      <Icon as={ContractIcon} data-testid="unrelated-operation-icon" {...commonProps} {...props} />
    );
  }
);
