import { type FlexProps, Heading, Icon } from "@chakra-ui/react";
import { type TransactionOperation } from "@umami/tzkt";

import { OperationTileView } from "./OperationTileView";
import { TzktLink } from "./TzktLink";
import { useFee } from "./useFee";
import { useOperationStatus } from "./useOperationStatus";
import { ContractIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const ContractCallTile = ({
  operation,
  ...props
}: { operation: TransactionOperation } & FlexProps) => {
  const color = useColor();
  const fee = useFee(operation);
  const status = useOperationStatus(operation.level, operation.status);

  return (
    <OperationTileView
      data-testid="operation-tile-contract-call"
      destination="outgoing"
      fee={fee}
      from={operation.sender}
      icon={
        <Icon as={ContractIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
      }
      operationType="Contract Call"
      status={status}
      timestamp={operation.timestamp}
      title={
        <ContractCallTileTitle
          counter={operation.counter}
          entrypoint={operation.parameter?.entrypoint}
          hash={operation.hash}
        />
      }
      to={operation.target}
      {...props}
    />
  );
};

export const ContractCallTileTitle = ({
  counter,
  hash,
  entrypoint,
}: {
  counter: number;
  hash: string;
  entrypoint: string | undefined;
}) => {
  const color = useColor();
  return (
    <TzktLink counter={counter} data-testid="title" hash={hash}>
      <Heading color={color("900")} size="sm">
        Contract call: {entrypoint}
      </Heading>
    </TzktLink>
  );
};
