import { validateAddress, ValidationResult } from "@taquito/utils";
import { Asset, getRealAmount } from "../../types/Asset";
import { parseNonNegativeFloat } from "../../utils/helpers";
import { OperationValue } from "../sendForm/types";
import { CSVRow } from "./types";

export const parseToCSVRow = (row: string[]): CSVRow => {
  const filteredRow = row.filter((v) => v.length > 0);
  const len = filteredRow.length;
  if (len < 2 || 4 < len) {
    throw new Error("Invalid csv format");
  }

  const [recipient, amountString, contract, tokenIdString] = filteredRow;
  const amount = parseNonNegativeFloat(amountString);

  if (validateAddress(recipient) !== ValidationResult.VALID) {
    throw new Error("Invalid csv value: recipient");
  }

  if (isNaN(amount) || amount === 0) {
    throw new Error("Invalid csv value: amount");
  }

  let res: CSVRow = {
    type: "tez",
    recipient,
    amount,
  };

  if (contract !== undefined) {
    if (validateAddress(contract) !== ValidationResult.VALID) {
      throw new Error("Invalid csv value: contract address");
    }
    res = { ...res, type: "fa1.2", contract };
    if (tokenIdString !== undefined) {
      const tokenId = parseNonNegativeFloat(tokenIdString);
      if (isNaN(tokenId)) {
        throw new Error("Invalid csv value: tokenId");
      }
      res = { ...res, type: "fa2", tokenId };
    }
  }

  return res;
};

export const csvRowToOperationValue = (
  sender: string,
  csvRow: CSVRow,
  contractToAsset: Record<string, Asset>
): OperationValue => {
  const value = {
    sender,
    amount: csvRow.amount,
    recipient: csvRow.recipient,
  };
  switch (csvRow.type) {
    case "tez":
      return {
        type: "tez",
        value,
      };
    case "fa1.2": {
      const asset = contractToAsset[csvRow.contract];
      if (!asset) {
        throw new Error(
          `Token "${csvRow.contract}" is not owned by the sender`
        );
      }
      value.amount = getRealAmount(value.amount, asset);
      if (asset.type !== "fa1.2" || csvRow.contract !== asset.contract) {
        throw new Error(`Inconsistent csv value for token ${csvRow.contract}`);
      }
      return {
        type: "token",
        data: {
          type: "fa1.2",
          contract: asset.contract,
          balance: asset.balance,
        },
        value,
      };
    }
    case "fa2": {
      const asset = contractToAsset[csvRow.contract];
      if (!asset) {
        throw new Error(
          `Token "${csvRow.contract}" is not owned by the sender`
        );
      }
      value.amount = getRealAmount(value.amount, asset);

      if (asset.type === "fa1.2" || csvRow.contract !== asset.contract) {
        throw new Error(`Inconsistent csv value for token ${csvRow.contract}`);
      }

      const baseData = {
        contract: asset.contract,
        balance: asset.balance,
        tokenId: `${csvRow.tokenId}`,
      };

      switch (asset.type) {
        case "fa2":
          return {
            type: "token",
            data: { ...baseData, type: "fa2", metadata: asset.metadata },
            value,
          };
        case "nft":
          return {
            type: "token",
            data: {
              ...baseData,
              type: "nft",
              owner: asset.owner,
              metadata: asset.metadata,
            },
            value,
          };
      }
    }
  }
};
