import { mockContract, mockPkh } from "../../mocks/factories";
import { csvRowToOperationValue, parseToCSVRow } from "./utils";
import { fa1Token, fa2Token, nft } from "../../mocks/tzktResponse";
import { classifyToken } from "../../utils/token/classify/classifyToken";
import { FA12Token, FA2Token, NFT } from "../../types/Asset";
import { CSVRow } from "./types";
describe("csv utils", () => {
  test("parse valid csv rows", async () => {
    const res = [
      [mockPkh(0), "1.23456", "", ""],
      [mockPkh(0), "1000", mockContract(0), "2"],
      [mockPkh(0), "2000", mockContract(0)],
    ].map(parseToCSVRow);

    expect(res).toEqual([
      {
        type: "tez",
        recipient: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
        amount: 1.23456,
      },
      {
        type: "fa2",
        recipient: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
        amount: 1000,
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob0",
        tokenId: 2,
      },
      {
        type: "fa1.2",
        recipient: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
        amount: 2000,
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob0",
      },
    ]);
  });

  test("throws error for row with wrong length", async () => {
    expect(() => parseToCSVRow([])).toThrow("Invalid csv format");
    expect(() => parseToCSVRow(["a", "b", "c", "d", "e"])).toThrowError(
      "Invalid csv format"
    );
  });

  test("throws error for row with invalid recipient", async () => {
    expect(() => parseToCSVRow(["Invalid pkh", "-1.23456", "", ""])).toThrow(
      "Invalid csv value: recipient"
    );
  });

  test("throws error for row with invalid amount", async () => {
    expect(() => parseToCSVRow([mockPkh(0), "-1.23456", "", ""])).toThrow(
      "Invalid csv value: amount"
    );
    expect(() => parseToCSVRow([mockPkh(0), "0", "", ""])).toThrow(
      "Invalid csv value: amount"
    );
  });

  test("throws error for row with invalid contract address", async () => {
    expect(() =>
      parseToCSVRow([mockPkh(0), "1.23456", "Invalid kt", ""])
    ).toThrow("Invalid csv value: contract address");
  });

  test("throws error for row with invalid tokenId", async () => {
    expect(() =>
      parseToCSVRow([mockPkh(0), "1000", mockContract(0), "-1"])
    ).toThrow("Invalid csv value: tokenId");
  });

  test("converts CSVTezTransferRow to OperationValue", () => {
    const mockCSVTezTransferRow = {
      type: "tez",
      recipient: mockPkh(1),
      amount: 1,
    } as CSVRow;
    const res = csvRowToOperationValue(mockPkh(0), mockCSVTezTransferRow, {});
    expect(res).toEqual({
      type: "tez",
      value: {
        amount: 1,
        recipient: mockPkh(1),
        sender: mockPkh(0),
      },
    });
  });

  test("converts CSVFA12TransferRow to OperationValue", () => {
    const fa12 = classifyToken(fa1Token) as FA12Token;
    const mockCSVFA12TransferRow = {
      type: "fa1.2",
      recipient: mockPkh(1),
      amount: 1,
      contract: fa12.contract,
    } as CSVRow;
    const res = csvRowToOperationValue(mockPkh(0), mockCSVFA12TransferRow, {
      [fa12.contract]: fa12,
    });
    expect(res).toEqual({
      type: "token",
      data: {
        balance: fa12.balance,
        contract: fa12.contract,
        type: "fa1.2",
      },
      value: {
        amount: 1,
        recipient: mockPkh(1),
        sender: mockPkh(0),
      },
    });
  });

  test("converts CSVFA2TransferRow to OperationValue", () => {
    const fa2 = classifyToken(fa2Token) as FA2Token;
    const mockCSVFA2TransferRow = {
      type: "fa2",
      recipient: mockPkh(1),
      amount: 1,
      contract: fa2.contract,
      tokenId: parseInt(fa2.tokenId),
    } as CSVRow;
    const res = csvRowToOperationValue(mockPkh(0), mockCSVFA2TransferRow, {
      [fa2.contract]: fa2,
    });
    expect(res).toEqual({
      type: "token",
      data: {
        balance: fa2.balance,
        contract: fa2.contract,
        metadata: fa2.metadata,
        tokenId: fa2.tokenId,
        type: "fa2",
      },
      value: {
        amount: 1,
        recipient: mockPkh(1),
        sender: mockPkh(0),
      },
    });
  });

  test("converts NFT CSVFA2TransferRow to OperationValue", () => {
    const fa2NFT = classifyToken(nft) as NFT;
    const mockCSVFA2TransferRow = {
      type: "fa2",
      recipient: mockPkh(1),
      amount: 1,
      contract: fa2NFT.contract,
      tokenId: parseInt(fa2NFT.tokenId),
    } as CSVRow;
    const res = csvRowToOperationValue(mockPkh(0), mockCSVFA2TransferRow, {
      [fa2NFT.contract]: fa2NFT,
    });
    expect(res).toEqual({
      type: "token",
      data: {
        balance: fa2NFT.balance,
        contract: fa2NFT.contract,
        metadata: fa2NFT.metadata,
        tokenId: fa2NFT.tokenId,
        owner: fa2NFT.owner,
        type: "nft",
      },
      value: {
        amount: 1,
        recipient: mockPkh(1),
        sender: mockPkh(0),
      },
    });
  });

  test("thorws error for tokens not held by the sender", () => {
    const fa2NFT = classifyToken(nft) as NFT;
    const mockCSVFA2TransferRow = {
      type: "fa2",
      recipient: mockPkh(1),
      amount: 1,
      contract: fa2NFT.contract,
      tokenId: parseInt(fa2NFT.tokenId),
    } as CSVRow;
    expect(() =>
      csvRowToOperationValue(mockPkh(0), mockCSVFA2TransferRow, {})
    ).toThrowError("Error converting from csv to operation value");
  });
});
