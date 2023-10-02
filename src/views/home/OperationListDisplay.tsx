import React from "react";
import NestedScroll from "../../components/NestedScroll";
import { NoOperations } from "../../components/NoItems";
import { OperationTile } from "../../components/OperationTile";
import { TzktCombinedOperation } from "../../utils/tezos";
import { Box, Divider } from "@chakra-ui/react";

export const OperationListDisplay: React.FC<{ operations: TzktCombinedOperation[] }> = ({
  operations,
}) => {
  if (operations.length === 0) {
    return <NoOperations small />;
  }

  return (
    <NestedScroll>
      {operations.slice(0, 20).map(operation => (
        <Box key={operation.id} height="90px">
          <OperationTile operation={operation} />
          <Divider my="20px" />
        </Box>
      ))}
    </NestedScroll>
  );
};
