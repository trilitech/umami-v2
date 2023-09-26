import React from "react";
import NestedScroll from "../../../components/NestedScroll";
import { NoOperations } from "../../../components/NoItems";
import { OperationTile } from "../../../components/OperationTile";
import { TzktCombinedOperation } from "../../../utils/tezos";

export const OperationListDisplay: React.FC<{ operations: TzktCombinedOperation[] }> = ({
  operations,
}) => {
  if (operations.length === 0) {
    return <NoOperations small />;
  }

  const operationEls = operations.slice(0, 20).map(operation => {
    return <OperationTile key={operation.id} operation={operation} />;
  });

  return <NestedScroll>{operationEls}</NestedScroll>;
};
