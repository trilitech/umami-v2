import { Operation } from "../../../multisig/types";
import { parseContractPkh, parseImplicitPkh, parsePkh } from "../../../types/Address";
import { OperationValue } from "../types";

export const toLambdaOperation = (operation: OperationValue): Operation => {
  switch (operation.type) {
    case "tez":
      return {
        type: "tez",
        amount: operation.value.amount,
        recipient: parsePkh(operation.value.recipient),
      };
      break;
    case "token":
      if (operation.data.type === "fa1.2") {
        return {
          type: "fa1.2",
          amount: operation.value.amount,
          contract: parseContractPkh(operation.data.contract),
          recipient: parsePkh(operation.value.recipient),
          sender: parsePkh(operation.value.sender),
        };
      } else {
        return {
          type: "fa2",
          amount: operation.value.amount,
          contract: parseContractPkh(operation.data.contract),
          recipient: parsePkh(operation.value.recipient),
          sender: parsePkh(operation.value.sender),
          tokenId: operation.data.tokenId,
        };
      }

    case "delegation":
      return {
        type: "delegation",
        recipient: operation.value.recipient
          ? parseImplicitPkh(operation.value.recipient)
          : undefined,
      };
  }
};
