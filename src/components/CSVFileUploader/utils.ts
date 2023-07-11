import {
  isAddressValid,
  isValidContractPkh,
  parseContractPkh,
  parsePkh,
} from "../../types/Address";
import { Token } from "../../types/Token";
import { getRealAmount } from "../../types/TokenBalance";
import { tezToMutez } from "../../utils/format";
import { validateNonNegativeNumber } from "../../utils/helpers";
import { OperationValue } from "../sendForm/types";
import { CSVRow } from "./types";

export const parseToCSVRow = (row: string[]): CSVRow => {
  const filteredRow = row.filter(v => v.length > 0);
  const len = filteredRow.length;
  if (len < 2 || 4 < len) {
    throw new Error("Invalid csv format");
  }

  const [recipient, prettyAmount, contract, tokenId] = filteredRow;
  const checkedPrettyAmount = validateNonNegativeNumber(prettyAmount);

  if (!isAddressValid(recipient)) {
    throw new Error("Invalid csv value: recipient");
  }

  if (checkedPrettyAmount === null || checkedPrettyAmount === "0") {
    throw new Error("Invalid csv value: amount");
  }

  let res: CSVRow = {
    type: "tez",
    recipient,
    prettyAmount,
  };

  if (contract !== undefined) {
    if (!isValidContractPkh(contract)) {
      throw new Error("Invalid csv value: contract address");
    }
    res = { ...res, type: "fa1.2", contract, tokenId: "0" };
    if (tokenId !== undefined) {
      const checkedTokenId = validateNonNegativeNumber(tokenId);
      if (checkedTokenId === null) {
        throw new Error("Invalid csv value: tokenId");
      }
      res = { ...res, type: "fa2", tokenId: checkedTokenId };
    }
  }

  return res;
};

export const csvRowToOperationValue = (
  sender: string,
  csvRow: CSVRow,
  getToken: (contract: string, tokenId: string) => Token | undefined
): OperationValue => {
  if (csvRow.type === "tez") {
    return {
      type: "tez",
      recipient: parsePkh(csvRow.recipient),
      amount: tezToMutez(csvRow.prettyAmount).toString(),
    };
  }
  const token = getToken(csvRow.contract, csvRow.tokenId);
  if (!token) {
    throw new Error(`Unknown token ${csvRow.contract} ${csvRow.tokenId}`);
  }
  const commonValues = {
    sender: parsePkh(sender),
    recipient: parsePkh(csvRow.recipient),
    amount: getRealAmount(token, csvRow.prettyAmount).toString(),
    contract: parseContractPkh(csvRow.contract),
  };
  if (csvRow.type === "fa1.2") {
    return {
      ...commonValues,
      type: "fa1.2",
      tokenId: csvRow.tokenId,
    };
  }
  return {
    ...commonValues,
    type: "fa2",
    tokenId: csvRow.tokenId,
  };
};
