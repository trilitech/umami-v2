import { Box, Divider } from "@chakra-ui/react";
import React from "react";

import { ViewAllLink } from "./ViewAllLink";
import { RawPkh } from "../../../types/Address";
import { TzktCombinedOperation } from "../../../utils/tezos";
import { NoOperations } from "../../NoItems";
import { OperationTile } from "../../OperationTile";

const MAX_OPERATIONS_SIZE = 20;

/**
 * Operations list to be displayed in the account drawer
 * Limits the total number of displayed operations to {@link MAX_OPERATIONS_SIZE}
 */
export const OperationListDisplay: React.FC<{
  owner: RawPkh;
  operations: TzktCombinedOperation[];
}> = ({ owner, operations }) => {
  if (operations.length === 0) {
    return <NoOperations small />;
  }

  const chunk = operations.slice(0, MAX_OPERATIONS_SIZE);

  return (
    <>
      {chunk.map((operation, i) => (
        <Box key={operation.id} height="90px">
          <OperationTile operation={operation} />
          {i < chunk.length - 1 && <Divider marginY="20px" />}
        </Box>
      ))}
      <ViewAllLink to={`/operations?accounts=${owner}`} />
    </>
  );
};
