import { type FlexProps, Heading, Icon, Text } from "@chakra-ui/react";
import { prettyTezAmount } from "@umami/tezos";
import { type FinalizeUnstakeOperation } from "@umami/tzkt";

import { OperationTileView } from "./OperationTileView";
import { TzktLink } from "./TzktLink";
import { useFee } from "./useFee";
import { useOperationStatus } from "./useOperationStatus";
import { DelegateIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const FinalizeUnstakeTile = ({
  operation,
  ...props
}: { operation: FinalizeUnstakeOperation } & FlexProps) => {
  const color = useColor();
  const amount = prettyTezAmount(operation.amount);
  const fee = useFee(operation);
  const status = useOperationStatus(operation.level, operation.status);

  return (
    <OperationTileView
      data-testid="operation-tile-finalize-unstake"
      destination="outgoing"
      fee={fee}
      icon={
        <Icon as={DelegateIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
      }
      operationType="Finalize Unstake"
      status={status}
      timestamp={operation.timestamp}
      title={
        <TzktLink counter={operation.counter} data-testid="title" hash={operation.hash}>
          <Heading color={color("900")} size="sm">
            Finalize Unstake:
          </Heading>
          <Text>{amount}</Text>
        </TzktLink>
      }
      to={operation.sender}
      {...props}
    />
  );
};
