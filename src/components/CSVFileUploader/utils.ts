import { validateAddress, ValidationResult } from "@taquito/utils";
import { Asset, getRealAmount } from "../../types/Asset";
import { tezToMutez } from "../../utils/format";
import { validateNonNegativeNumber } from "../../utils/helpers";
import { OperationValue } from "../sendForm/types";
import { CSVRow } from "./types";

export const parseToCSVRow = (row: string[]): CSVRow => {
  const filteredRow = row.filter((v) => v.length > 0);
  const len = filteredRow.length;
  if (len < 2 || 4 < len) {
    throw new Error("Invalid csv format");
  }

  const [recipient, prettyAmount, contract, tokenId] = filteredRow;
  const checkedPrettyAmount = validateNonNegativeNumber(prettyAmount);

  if (validateAddress(recipient) !== ValidationResult.VALID) {
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
    if (validateAddress(contract) !== ValidationResult.VALID) {
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
  contractToAsset: Record<string, Asset>
): OperationValue => {
  const baseValue = {
    sender,
    recipient: csvRow.recipient,
  };
  switch (csvRow.type) {
    case "tez":
      return {
        type: "tez",
        value: {
          ...baseValue,
          amount: tezToMutez(csvRow.prettyAmount),
        },
      };
    case "fa1.2": {
      const asset = contractToAsset[csvRow.contract];
      if (!asset) {
        throw new Error(
          `Token "${csvRow.contract}" is not owned by the sender`
        );
      }
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
        value: {
          ...baseValue,
          amount: getRealAmount(csvRow.prettyAmount, asset),
        },
      };
    }
    case "fa2": {
      const asset = contractToAsset[csvRow.contract];
      if (!asset) {
        throw new Error(
          `Token "${csvRow.contract}" is not owned by the sender`
        );
      }

      const value = {
        ...baseValue,
        amount: getRealAmount(csvRow.prettyAmount, asset),
      };

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
