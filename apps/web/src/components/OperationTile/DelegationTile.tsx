import { type FlexProps, Heading, Icon } from "@chakra-ui/react";
import { type DelegationOperation } from "@umami/tzkt";

import { OperationTileView } from "./OperationTileView";
import { TzktLink } from "./TzktLink";
import { useFee } from "./useFee";
import { useOperationStatus } from "./useOperationStatus";
import { DelegateIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const DelegationTile = ({
  operation,
  ...props
}: { operation: DelegationOperation } & FlexProps) => {
  const color = useColor();
  const operationType = operation.newDelegate ? "Delegate" : "Delegation Ended";
  const fee = useFee(operation);
  const status = useOperationStatus(operation.level, operation.status);

  return (
    <OperationTileView
      data-testid="operation-tile-delegation"
      destination="outgoing"
      fee={fee}
      from={operation.sender}
      icon={
        <Icon as={DelegateIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
      }
      operationType={operationType}
      status={status}
      timestamp={operation.timestamp}
      title={
        <TzktLink counter={operation.counter} data-testid="title" hash={operation.hash}>
          <Heading color={color("900")} size="sm">
            {operationType}
          </Heading>
        </TzktLink>
      }
      to={operation.newDelegate}
      {...props}
    />
  );
};
