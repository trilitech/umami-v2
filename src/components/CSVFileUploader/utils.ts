import { isAddressValid, isValidContractPkh, parsePkh } from "../../types/Address";
import { Asset, getRealAmount } from "../../types/Asset";
import { tezToMutez } from "../../utils/format";
import { validateNonNegativeNumber } from "../../utils/helpers";
import { classifyAsset, OperationValue } from "../sendForm/types";
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
    res = { ...res, type: "fa1.2", contract };
    if (tokenId !== undefined) {
      const checkedTokenId = validateNonNegativeNumber(tokenId);
      if (checkedTokenId === null) {
        throw new Error("Invalid csv value: tokenId");
      }
      res = { ...res, type: "fa2", tokenId: Number(checkedTokenId) };
    }
  }

  return res;
};

export const csvRowToOperationValue = (
  sender: string,
  csvRow: CSVRow,
  contractToAssets: Record<string, Asset[] | undefined>
): OperationValue => {
  const recipient = csvRow.recipient;

  if (csvRow.type === "tez") {
    return {
      type: "tez",
      recipient: parsePkh(recipient),
      amount: tezToMutez(csvRow.prettyAmount).toString(),
    };
  }

  const assets = contractToAssets[csvRow.contract] ?? [];

  const asset =
    csvRow.type === "fa1.2"
      ? assets[0]
      : assets.find(asset => !(asset.type === "fa1.2") && asset.tokenId === `${csvRow.tokenId}`);

  if (!asset) {
    throw new Error(`Token "${csvRow.contract}" is not owned by the sender`);
  }

  if (csvRow.contract !== asset.contract || (asset.type === "fa1.2" && csvRow.type !== "fa1.2")) {
    throw new Error(`Inconsistent csv value for token ${csvRow.contract}`);
  }

  return classifyAsset(asset, {
    sender: sender,
    recipient: recipient,
    amount: getRealAmount(asset, csvRow.prettyAmount).toString(),
  });
};
