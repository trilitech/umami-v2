import { Flex, type FlexProps, Heading, Icon, Text } from "@chakra-ui/react";
import { prettyTezAmount } from "@umami/tezos";
import { type UnstakeOperation } from "@umami/tzkt";

import { OperationTileView } from "./OperationTileView";
import { TzktLink } from "./TzktLink";
import { useFee } from "./useFee";
import { useOperationStatus } from "./useOperationStatus";
import { DelegateIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const UnstakeTile = ({
  operation,
  ...props
}: { operation: UnstakeOperation } & FlexProps) => {
  const color = useColor();
  const amount = prettyTezAmount(operation.amount);

  const fee = useFee(operation);

  const status = useOperationStatus(operation.level, operation.status);

  return (
    <OperationTileView
      data-testid="operation-tile-unstake"
      destination="outgoing"
      fee={fee}
      from={operation.baker}
      icon={
        <Icon as={DelegateIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
      }
      operationType="Unstake"
      status={status}
      timestamp={operation.timestamp}
      title={
        <TzktLink counter={operation.counter} data-testid="title" hash={operation.hash}>
          <Flex gap="4px">
            <Heading color={color("900")} size="sm">
              Unstake:
            </Heading>
            <Text lineHeight="22px">{amount}</Text>
          </Flex>
        </TzktLink>
      }
      to={operation.sender}
      {...props}
    />
  );
};
