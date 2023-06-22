import React from "react";
import NestedScroll from "../../../components/NestedScroll";
import { NoOperations } from "../../../components/NoItems/NoItems";
import { OperationTile } from "../../../components/OperationTile";
import { OperationDisplay } from "../../../types/Operation";
import { getKey } from "../../operations/operationsUtils";

export const OperationListDisplay: React.FC<{ operations: OperationDisplay[] }> = ({
  operations,
}) => {
  if (operations.length === 0) {
    return <NoOperations small />;
  }

  const operationEls = operations.slice(0, 20).map(op => {
    return <OperationTile key={getKey(op)} operation={op} />;
  });

  return <NestedScroll>{operationEls}</NestedScroll>;
};
