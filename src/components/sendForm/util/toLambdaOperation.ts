import { RawOperation } from "../../../types/RawOperation";
import { parseContractPkh, parseImplicitPkh, parsePkh } from "../../../types/Address";
import { OperationValue } from "../types";

export const toLambdaOperation = (operation: OperationValue): RawOperation => {
  switch (operation.type) {
    case "tez":
      return {
        type: "tez",
        amount: operation.amount,
        recipient: parsePkh(operation.recipient.pkh),
      };
      break;
    case "fa1.2":
    case "fa2":
      if (operation.data.type === "fa1.2") {
        return {
          type: "fa1.2",
          amount: operation.amount,
          contract: parseContractPkh(operation.data.contract),
          recipient: parsePkh(operation.recipient.pkh),
          sender: parsePkh(operation.sender.pkh),
        };
      } else {
        return {
          type: "fa2",
          amount: operation.amount,
          contract: parseContractPkh(operation.data.contract),
          recipient: parsePkh(operation.recipient.pkh),
          sender: parsePkh(operation.sender.pkh),
          tokenId: operation.data.tokenId,
        };
      }

    case "delegation":
      return {
        type: "delegation",
        recipient: operation.recipient ? parseImplicitPkh(operation.recipient.pkh) : undefined,
      };
  }
};
