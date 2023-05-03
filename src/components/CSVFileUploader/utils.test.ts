import { mockContract, mockPkh } from "../../mocks/factories";
import { parseToCSVRow } from "./utils";

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
});
