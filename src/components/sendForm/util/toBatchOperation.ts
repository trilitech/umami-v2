import { Operation } from "../../../multisig/types";
import { OperationValue } from "../types";

export const toBatchOperation = (operation: OperationValue): Operation => {
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
        recipient: operation.value.recipient,
      };
  }
};
