import { Flex, type FlexProps } from "@chakra-ui/react";
import { memo } from "react";

import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";

export const RightBlock = memo(
  ({
    level,
    status,
    operationType,
    timestamp,
    ...props
  }: {
    level: number;
    status?: string;
    operationType: string;
    timestamp: string | undefined;
  } & FlexProps) => (
    <Flex gap="10px" {...props}>
      <Timestamp timestamp={timestamp} />

      <Flex gap="4px">
        <OperationTypeWrapper>{operationType}</OperationTypeWrapper>
        <OperationStatus level={level} status={status} />
      </Flex>
    </Flex>
  )
);
