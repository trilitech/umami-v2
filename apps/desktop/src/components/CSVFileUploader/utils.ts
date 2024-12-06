import { type Operation, getRealAmount } from "@umami/core";
import { type TokenLookup } from "@umami/state";
import {
  type Address,
  isAddressValid,
  isValidContractPkh,
  parseContractPkh,
  parsePkh,
  tezToMutez,
} from "@umami/tezos";
import { CustomError } from "@umami/utils";

import { validateNonNegativeNumber } from "../../utils/helpers";

export const parseOperation = (
  sender: Address,
  row: string[],
  getToken: TokenLookup
): Operation => {
  const filteredRow = row.filter(col => col.length > 0);
  const len = filteredRow.length;
  if (len < 2 || 4 < len) {
    throw new CustomError("Invalid csv format");
  }
  const [recipientPkh, prettyAmount, contractPkh] = filteredRow;
  if (!isAddressValid(recipientPkh)) {
    throw new CustomError("Invalid csv value: recipient");
  }
  const recipient = parsePkh(recipientPkh);

  if (validateNonNegativeNumber(prettyAmount) === null) {
    throw new CustomError("Invalid csv value: amount");
  }

  if (len === 2) {
    return {
      type: "tez",
      recipient,
      amount: tezToMutez(prettyAmount).toFixed(),
    };
  }

  if (!isValidContractPkh(contractPkh)) {
    throw new CustomError("Invalid csv value: contract address");
  }

  const contract = parseContractPkh(contractPkh);
  const tokenId = filteredRow[3] || "0";
  if (validateNonNegativeNumber(tokenId) === null) {
    throw new CustomError("Invalid csv value: tokenId");
  }

  const token = getToken(contractPkh, tokenId);
  if (!token) {
    throw new CustomError(`Unknown token ${contractPkh} ${tokenId}`);
  }
  const amount = getRealAmount(token, prettyAmount);

  if (token.type === "fa1.2") {
    return {
      type: "fa1.2",
      sender,
      amount,
      recipient,
      contract,
      tokenId: "0",
    };
  }

  return {
    type: "fa2",
    sender,
    recipient,
    contract,
    tokenId,
    amount,
  };
};
