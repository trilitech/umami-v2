import { validateAddress, ValidationResult } from "@taquito/utils";
import { parseNonNegativeFloat } from "../../utils/helpers";
import { CSVParsedRow } from "./types";

export const parseCSVRow = (row: string[]): CSVParsedRow => {
  const filteredRow = row.filter((v) => v.length > 0);
  const len = filteredRow.length;
  if (len < 2 || 4 < len) {
    throw new Error("invalid csv format");
  }

  const [recipient, amountString, contract, tokenIdString] = filteredRow;

  if (validateAddress(recipient) !== ValidationResult.VALID) {
    throw new Error("invalid csv value: recipient");
  }

  const amount = parseNonNegativeFloat(amountString);
  if (isNaN(amount) || amount === 0) {
    throw new Error("invalid csv value: amount");
  }

  let res: CSVParsedRow = {
    recipient,
    amount,
  };

  if (contract !== undefined) {
    if (validateAddress(contract) !== ValidationResult.VALID) {
      throw new Error("invalid csv value: contract address");
    }
    res = { ...res, contract };
  }

  if (tokenIdString !== undefined) {
    const tokenId = parseNonNegativeFloat(tokenIdString);
    if (isNaN(tokenId)) {
      throw new Error("invalid csv value: tokenId");
    }
    res = { ...res, tokenId };
  }

  return res;
};
