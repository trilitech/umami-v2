import { type FlexProps, Heading, Text } from "@chakra-ui/react";
import { operationSign } from "@umami/core";
import { useGetOperationDestination } from "@umami/state";
import { TEZ, formatTezAmount } from "@umami/tezos";
import { type TransactionOperation } from "@umami/tzkt";

import { OperationTileView } from "./OperationTileView";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { TzktLink } from "./TzktLink";
import { useFee } from "./useFee";
import { useOperationColor } from "./useOperationColor";
import { useOperationStatus } from "./useOperationStatus";

export const TransactionTile = ({
  operation,
  ...props
}: { operation: TransactionOperation } & FlexProps) => {
  const destination = useGetOperationDestination(
    operation.sender.address,
    operation.target?.address
  );
  const amount = formatTezAmount(operation.amount);
  const titleColor = useOperationColor(destination);
  const sign = operationSign(destination);
  const fee = useFee(operation);

  const status = useOperationStatus(operation.level, operation.status);

  return (
    <OperationTileView
      data-testid="operation-tile-transaction"
      destination={destination}
      fee={fee}
      from={operation.sender}
      icon={<TransactionDirectionIcon marginRight="8px" destination={destination} />}
      operationType="Transaction"
      status={status}
      timestamp={operation.timestamp}
      title={
        <TzktLink
          color={titleColor}
          counter={operation.counter}
          data-testid="title"
          hash={operation.hash}
        >
          <Heading color={titleColor} size="sm">
            {sign} {amount}{" "}
            <Text display="inline" color={titleColor} fontWeight={400}>
              {TEZ}
            </Text>
          </Heading>
        </TzktLink>
      }
      to={operation.target}
      {...props}
    />
  );
};
