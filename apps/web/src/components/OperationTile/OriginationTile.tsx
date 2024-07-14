import { type FlexProps, Heading, Icon } from "@chakra-ui/react";
import { CODE_HASH, TYPE_HASH } from "@umami/multisig";
import { type OriginationOperation } from "@umami/tzkt";

import { OperationTileView } from "./OperationTileView";
import { TzktLink } from "./TzktLink";
import { useFee } from "./useFee";
import { useOperationStatus } from "./useOperationStatus";
import { ContractIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const OriginationTile = ({
  operation,
  ...props
}: { operation: OriginationOperation } & FlexProps) => {
  const color = useColor();
  const fee = useFee(operation);
  const status = useOperationStatus(operation.level, operation.status);

  const isMultisig =
    operation.originatedContract?.codeHash === CODE_HASH &&
    operation.originatedContract.typeHash === TYPE_HASH;

  const contractTitle = isMultisig ? "Multisig Account Created" : "Contract Origination";

  return (
    <OperationTileView
      data-testid="operation-tile-origination"
      destination="outgoing"
      fee={fee}
      from={operation.sender}
      icon={
        <Icon as={ContractIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
      }
      operationType="Contract Origination"
      status={status}
      timestamp={operation.timestamp}
      title={
        <OriginationTileTitle
          counter={operation.counter}
          hash={operation.hash}
          operationType={contractTitle}
        />
      }
      {...props}
    />
  );
};

export const OriginationTileTitle = ({
  counter,
  hash,
  operationType,
}: {
  counter: number;
  hash: string;
  operationType: string;
}) => {
  const color = useColor();

  return (
    <TzktLink counter={counter} data-testid="title" hash={hash}>
      <Heading color={color("900")} size="sm">
        {operationType}
      </Heading>
    </TzktLink>
  );
};
