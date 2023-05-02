import { mockContract, mockPkh } from "../../mocks/factories";
import { parseCSVRow } from "./utils";

describe("csv utils", () => {
  test("parse valid csv rows", async () => {
    const res = [
      [mockPkh(0), "1.23456", "", ""],
      [mockPkh(0), "1000", mockContract(0), "2"],
      [mockPkh(0), "2000", mockContract(0)],
    ].map(parseCSVRow);

    expect(res).toEqual([
      {
        recipient: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
        amount: 1.23456,
      },
      {
        recipient: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
        amount: 1000,
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob0",
        tokenId: 2,
      },
      {
        recipient: "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
        amount: 2000,
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob0",
      },
    ]);
  });

  test("throws error for row with wrong length", async () => {
    expect(() => parseCSVRow([])).toThrow("invalid csv format");
    expect(() => parseCSVRow(["a", "b", "c", "d", "e"])).toThrowError(
      "invalid csv format"
    );
  });

  test("throws error for row with invalid recipient", async () => {
    expect(() => parseCSVRow(["invalid pkh", "-1.23456", "", ""])).toThrow(
      "invalid csv value: recipient"
    );
  });

  test("throws error for row with invalid amount", async () => {
    expect(() => parseCSVRow([mockPkh(0), "-1.23456", "", ""])).toThrow(
      "invalid csv value: amount"
    );
    expect(() => parseCSVRow([mockPkh(0), "0", "", ""])).toThrow(
      "invalid csv value: amount"
    );
  });

  test("throws error for row with invalid contract address", async () => {
    expect(() =>
      parseCSVRow([mockPkh(0), "1.23456", "Invalid kt", ""])
    ).toThrow("invalid csv value: contract address");
  });

  test("throws error for row with invalid tokenId", async () => {
    expect(() =>
      parseCSVRow([mockPkh(0), "1000", mockContract(0), "-1"])
    ).toThrow("invalid csv value: tokenId");
  });
});
