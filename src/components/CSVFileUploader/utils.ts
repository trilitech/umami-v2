import {
  Address,
  isAddressValid,
  isValidContractPkh,
  parseContractPkh,
  parsePkh,
} from "../../types/Address";
import { RawOperation } from "../../types/RawOperation";
import { getRealAmount } from "../../types/TokenBalance";
import { tezToMutez } from "../../utils/format";
import { validateNonNegativeNumber } from "../../utils/helpers";
import { TokenLookup } from "../../utils/hooks/tokensHooks";

export const parseOperation = (
  sender: Address,
  row: string[],
  getToken: TokenLookup
): RawOperation => {
  const filteredRow = row.filter(col => col.length > 0);
  const len = filteredRow.length;
  if (len < 2 || 4 < len) {
    throw new Error("Invalid csv format");
  }
  const [recipientPkh, prettyAmount, contractPkh] = filteredRow;
  if (!isAddressValid(recipientPkh)) {
    throw new Error("Invalid csv value: recipient");
  }
  const recipient = parsePkh(recipientPkh);

  if (validateNonNegativeNumber(prettyAmount) === null) {
    throw new Error("Invalid csv value: amount");
  }

  if (len === 2) {
    return {
      type: "tez",
      recipient,
      amount: tezToMutez(prettyAmount).toString(),
    };
  }

  if (!isValidContractPkh(contractPkh)) {
    throw new Error("Invalid csv value: contract address");
  }

  const contract = parseContractPkh(contractPkh);
  const tokenId = filteredRow[3] || "0";
  if (validateNonNegativeNumber(tokenId) === null) {
    throw new Error("Invalid csv value: tokenId");
  }

  const token = getToken(contractPkh, tokenId);
  if (!token) {
    throw new Error(`Unknown token ${contractPkh} ${tokenId}`);
  }
  const amount = getRealAmount(token, prettyAmount).toString();

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
