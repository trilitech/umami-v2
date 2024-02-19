import { Box, Divider } from "@chakra-ui/react";
import React from "react";

import { ViewAllLink } from "./ViewAllLink";
import { RawPkh } from "../../../types/Address";
import { TzktCombinedOperation } from "../../../utils/tezos";
import { NoOperations } from "../../NoItems";
import { OperationTile } from "../../OperationTile";

const MAX_OPERATIONS_SIZE = 20;

/**
 * List of {@link OperationTile} to be displayed in the account drawer.
 *
 * Contains operations related to the account.
 * The total number of displayed operations is limited to {@link MAX_OPERATIONS_SIZE}.
 *
 * @param owner - Address of the account for which the drawer was opened.
 * @param operations - List of owner's operations.
 */
export const OperationListDisplay: React.FC<{
  owner: RawPkh;
  operations: TzktCombinedOperation[];
}> = ({ owner, operations }) => {
  if (operations.length === 0) {
    return <NoOperations size="md" withViewAllButton={true} />;
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
      {operations.length > MAX_OPERATIONS_SIZE && <ViewAllLink owner={owner} to="/operations" />}
    </>
  );
};
