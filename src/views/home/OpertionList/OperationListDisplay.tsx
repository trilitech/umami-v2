import React from "react";
import NestedScroll from "../../../components/NestedScroll";
import { NoOperations } from "../../../components/NoItems";
import { OperationTile, OperationTileContext } from "../../../components/OperationTile";
import { TzktCombinedOperation } from "../../../utils/tezos";

export const OperationListDisplay: React.FC<{ operations: TzktCombinedOperation[] }> = ({
  operations,
}) => {
  if (operations.length === 0) {
    return <NoOperations small />;
  }

  return (
    <NestedScroll>
      {operations.slice(0, 20).map(operation => (
        <OperationTileContext.Provider key={operation.id} value={{ size: "small" }}>
          <OperationTile operation={operation} />
        </OperationTileContext.Provider>
      ))}
    </NestedScroll>
  );
};
