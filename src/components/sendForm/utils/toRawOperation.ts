import { LambdaOperations } from "../../../multisig/types";
import { BatchOperation, OperationValue } from "../types";

export const toBatchOperation = (operation: OperationValue): BatchOperation => {
  switch (operation.type) {
    case "tez":
      return {
        type: "tez",
        amount: operation.value.amount,
        recipient: operation.value.recipient,
      };
      break;
    case "token":
      if (operation.data.type === "fa1.2") {
        return {
          type: "fa1.2",
          amount: operation.value.amount,
          contract: operation.data.contract,
          recipient: operation.value.recipient,
          sender: operation.value.sender,
        };
      } else {
        return {
          type: "fa2",
          amount: operation.value.amount,
          contract: operation.data.contract,
          recipient: operation.value.recipient,
          sender: operation.value.sender,
          tokenId: operation.data.tokenId,
        };
      }

    case "delegation":
      return {
        type: "delegation",
        sender: operation.value.sender,
        recipient: operation.value.recipient,
      };
  }
};

// Lambda operations don't support tez transfer params yet, and don't requier the sender for delegations
export const toLambdaOperation = (operation: BatchOperation): LambdaOperations => {
  if (operation.type === "tez") {
    const { parameter, ...result } = operation;
    return result;
  }

  if (operation.type === "delegation") {
    const { sender, ...result } = operation;
    return result;
  }
  return operation;
};
