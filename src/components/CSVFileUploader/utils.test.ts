import { mockContract, mockPkh } from "../../mocks/factories";
import { csvRowToOperationValue, parseToCSVRow } from "./utils";
import { CSVRow } from "./types";
import { ghostFA12, ghostFA2, ghostTezzard } from "../../mocks/tokens";
import { BigNumber } from "bignumber.js";
import { FA12Token, FA2Token, NFT } from "../../types/Asset";

describe("csv utils", () => {
  test("parse valid csv rows", async () => {
    const res = [
      [mockPkh(0), "1.23456", "", ""],
      [mockPkh(0), "1000", mockContract(0), "2"],
      [mockPkh(0), "123456789123456789", mockContract(0)],
    ].map(parseToCSVRow);

    expect(res).toEqual([
      {
        type: "tez",
        recipient: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
        prettyAmount: "1.23456",
      },
      {
        type: "fa2",
        recipient: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
        prettyAmount: "1000",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob0",
        tokenId: 2,
      },
      {
        type: "fa1.2",
        recipient: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
        prettyAmount: "123456789123456789",
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
      prettyAmount: "1",
    } as CSVRow;
    const res = csvRowToOperationValue(mockPkh(0), mockCSVTezTransferRow, {});
    expect(res).toEqual({
      type: "tez",
      value: {
        amount: new BigNumber(1000000),
        recipient: mockPkh(1),
        sender: mockPkh(0),
      },
    });
  });

  test("converts CSVFA12TransferRow to OperationValue", () => {
    const mockCSVFA12TransferRow = {
      type: "fa1.2",
      recipient: mockPkh(1),
      prettyAmount: "10000",
      contract: ghostFA12.contract,
    } as CSVRow;
    const res = csvRowToOperationValue(mockPkh(0), mockCSVFA12TransferRow, {
      [ghostFA12.contract]: ghostFA12,
    });
    expect(res).toEqual({
      type: "token",
      data: new FA12Token(ghostFA12.contract, ghostFA12.balance),
      value: {
        amount: new BigNumber(100000000),
        recipient: mockPkh(1),
        sender: mockPkh(0),
      },
    });
  });

  test("converts CSVFA2TransferRow to OperationValue", () => {
    const mockCSVFA2TransferRow = {
      type: "fa2",
      recipient: mockPkh(1),
      prettyAmount: "1",
      contract: ghostFA2.contract,
      tokenId: parseInt(ghostFA2.tokenId),
    } as CSVRow;
    const res = csvRowToOperationValue(mockPkh(0), mockCSVFA2TransferRow, {
      [ghostFA2.contract]: ghostFA2,
    });
    expect(res).toEqual({
      type: "token",
      data: new FA2Token(
        ghostFA2.contract,
        ghostFA2.tokenId,
        ghostFA2.balance,
        ghostFA2.metadata
      ),
      value: {
        amount: new BigNumber(100000),
        recipient: mockPkh(1),
        sender: mockPkh(0),
      },
    });
  });

  test("converts NFT CSVFA2TransferRow to OperationValue", () => {
    const mockCSVFA2TransferRow = {
      type: "fa2",
      recipient: mockPkh(1),
      prettyAmount: "1",
      contract: ghostTezzard.contract,
      tokenId: parseInt(ghostTezzard.tokenId),
    } as CSVRow;
    const res = csvRowToOperationValue(mockPkh(0), mockCSVFA2TransferRow, {
      [ghostTezzard.contract]: ghostTezzard,
    });
    expect(res).toEqual({
      type: "token",
      data: new NFT(
        ghostTezzard.contract,
        ghostTezzard.tokenId,
        ghostTezzard.balance,
        ghostTezzard.owner,
        ghostTezzard.metadata
      ),
      value: {
        amount: new BigNumber(1),
        recipient: mockPkh(1),
        sender: mockPkh(0),
      },
    });
  });

  test("thorws error for tokens not held by the sender", () => {
    const mockCSVFA2TransferRow = {
      type: "fa2",
      recipient: mockPkh(1),
      prettyAmount: "100",
      contract: ghostTezzard.contract,
      tokenId: parseInt(ghostTezzard.tokenId),
    } as CSVRow;
    expect(() =>
      csvRowToOperationValue(mockPkh(0), mockCSVFA2TransferRow, {})
    ).toThrowError(
      `Token "${ghostTezzard.contract}" is not owned by the sender`
    );
  });
});
