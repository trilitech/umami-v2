import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { csvRowToOperationValue, parseToCSVRow } from "./utils";
import { CSVRow } from "./types";
import { ghostFA12, ghostFA2, ghostTezzard } from "../../mocks/tokens";
import type { NFT } from "../../types/Asset";

describe("csv utils", () => {
  test("parse valid csv rows", async () => {
    const res = [
      [mockImplicitAddress(0).pkh, "1.23456", "", ""],
      [mockImplicitAddress(0).pkh, "1000", mockContractAddress(0).pkh, "2"],
      [mockImplicitAddress(0).pkh, "123456789123456789", mockContractAddress(0).pkh],
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
        contract: "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
        tokenId: 2,
      },
      {
        type: "fa1.2",
        recipient: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
        prettyAmount: "123456789123456789",
        contract: "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
      },
    ]);
  });

  test("throws error for row with wrong length", async () => {
    expect(() => parseToCSVRow([])).toThrow("Invalid csv format");
    expect(() => parseToCSVRow(["a", "b", "c", "d", "e"])).toThrowError("Invalid csv format");
  });

  test("throws error for row with invalid recipient", async () => {
    expect(() => parseToCSVRow(["Invalid pkh", "-1.23456", "", ""])).toThrow(
      "Invalid csv value: recipient"
    );
  });

  test("throws error for row with invalid amount", async () => {
    expect(() => parseToCSVRow([mockImplicitAddress(0).pkh, "-1.23456", "", ""])).toThrow(
      "Invalid csv value: amount"
    );
    expect(() => parseToCSVRow([mockImplicitAddress(0).pkh, "0", "", ""])).toThrow(
      "Invalid csv value: amount"
    );
  });

  test("throws error for row with invalid contract address", async () => {
    expect(() => parseToCSVRow([mockImplicitAddress(0).pkh, "1.23456", "Invalid kt", ""])).toThrow(
      "Invalid csv value: contract address"
    );
  });

  test("throws error for row with invalid tokenId", async () => {
    expect(() =>
      parseToCSVRow([mockImplicitAddress(0).pkh, "1000", mockContractAddress(0).pkh, "-1"])
    ).toThrow("Invalid csv value: tokenId");
  });

  test("converts CSVTezTransferRow to OperationValue", () => {
    const mockCSVTezTransferRow = {
      type: "tez",
      recipient: mockImplicitAddress(1).pkh,
      prettyAmount: "1",
    } as CSVRow;
    const res = csvRowToOperationValue(mockImplicitAddress(0).pkh, mockCSVTezTransferRow, {});
    expect(res).toEqual({
      type: "tez",
      value: {
        amount: "1000000",
        recipient: mockImplicitAddress(1).pkh,
        sender: mockImplicitAddress(0).pkh,
      },
    });
  });

  test("converts CSVFA12TransferRow to OperationValue", () => {
    const mockCSVFA12TransferRow = {
      type: "fa1.2",
      recipient: mockImplicitAddress(1).pkh,
      prettyAmount: "10000",
      contract: ghostFA12.contract,
    } as CSVRow;
    const res = csvRowToOperationValue(mockImplicitAddress(0).pkh, mockCSVFA12TransferRow, {
      [ghostFA12.contract]: [ghostFA12],
    });
    expect(res).toEqual({
      type: "token",
      data: ghostFA12,
      value: {
        amount: "100000000",
        recipient: mockImplicitAddress(1).pkh,
        sender: mockImplicitAddress(0).pkh,
      },
    });
  });

  test("converts CSVFA2TransferRow to OperationValue", () => {
    const mockCSVFA2TransferRow = {
      type: "fa2",
      recipient: mockImplicitAddress(1).pkh,
      prettyAmount: "1",
      contract: ghostFA2.contract,
      tokenId: parseInt(ghostFA2.tokenId),
    } as CSVRow;
    const res = csvRowToOperationValue(mockImplicitAddress(0).pkh, mockCSVFA2TransferRow, {
      [ghostFA2.contract]: [ghostFA2],
    });
    expect(res).toEqual({
      type: "token",
      data: ghostFA2,
      value: {
        amount: "100000",
        recipient: mockImplicitAddress(1).pkh,
        sender: mockImplicitAddress(0).pkh,
      },
    });
  });

  test("converts NFT CSVFA2TransferRow to OperationValue", () => {
    const ghostTezzard1 = ghostTezzard;
    const ghostTezzard2: NFT = { ...ghostTezzard, tokenId: "8" };
    const mockCSVFA2TransferRow = {
      type: "fa2",
      recipient: mockImplicitAddress(1).pkh,
      prettyAmount: "1",
      contract: ghostTezzard1.contract,
      tokenId: parseInt(ghostTezzard1.tokenId),
    } as CSVRow;
    const res = csvRowToOperationValue(mockImplicitAddress(0).pkh, mockCSVFA2TransferRow, {
      [ghostTezzard.contract]: [ghostTezzard2, ghostTezzard1],
    });
    expect(res).toEqual({
      type: "token",
      data: {
        ...ghostTezzard1,
        type: "nft",
      },
      value: {
        amount: "1",
        recipient: mockImplicitAddress(1).pkh,
        sender: mockImplicitAddress(0).pkh,
      },
    });
  });

  test("thorws error for tokens not held by the sender", () => {
    const mockCSVFA2TransferRow = {
      type: "fa2",
      recipient: mockImplicitAddress(1).pkh,
      prettyAmount: "100",
      contract: ghostTezzard.contract,
      tokenId: parseInt(ghostTezzard.tokenId),
    } as CSVRow;
    expect(() =>
      csvRowToOperationValue(mockImplicitAddress(0).pkh, mockCSVFA2TransferRow, {})
    ).toThrowError(`Token "${ghostTezzard.contract}" is not owned by the sender`);
  });
});
