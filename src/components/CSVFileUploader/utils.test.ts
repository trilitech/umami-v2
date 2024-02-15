import { parseOperation } from "./utils";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { ghostFA12, ghostTezzard } from "../../mocks/tokens";
import { RawPkh, parseContractPkh } from "../../types/Address";
import { TokenLookup } from "../../utils/hooks/tokensHooks";

const emptyTokenLookup = (_contract: RawPkh, _tokenId: string) => undefined;
const sender = mockImplicitAddress(0);

const fixture = (row: string[], tokenLookup?: TokenLookup) => {
  return parseOperation(sender, row, tokenLookup || emptyTokenLookup);
};

describe("csv utils", () => {
  describe("validations", () => {
    it("throws when the row length is invalid", () => {
      const invalidLengths = [0, 1, 5];
      invalidLengths.forEach(len => {
        const invalidRow = Array(len).fill("data");
        expect(() => fixture(invalidRow)).toThrow("Invalid csv format");
      });
    });

    it("throws when recipient is invalid", () => {
      expect(() => fixture(["Invalid pkh", "-1.23456", "", ""])).toThrow(
        "Invalid csv value: recipient"
      );
    });

    it("throws when amount is invalid", () => {
      expect(() => fixture([mockImplicitAddress(1).pkh, "-1", "", ""])).toThrow(
        "Invalid csv value: amount"
      );
    });

    it("throws when contract address is invalid", () => {
      expect(() => fixture([mockImplicitAddress(1).pkh, "1.23456", "Invalid kt", ""])).toThrow(
        "Invalid csv value: contract address"
      );
    });

    it("throws when tokenId is less than 0", () => {
      expect(() =>
        fixture([mockImplicitAddress(1).pkh, "1000", mockContractAddress(0).pkh, "-1"])
      ).toThrow("Invalid csv value: tokenId");
    });

    it("throws when the token is not held by the sender", () => {
      const mockCSVFA2TransferRow = [
        mockImplicitAddress(1).pkh,
        "100",
        ghostTezzard.contract,
        ghostTezzard.tokenId,
      ];
      expect(() => parseOperation(sender, mockCSVFA2TransferRow, emptyTokenLookup)).toThrow(
        `Unknown token ${ghostTezzard.contract} ${ghostTezzard.tokenId}`
      );
    });
  });

  it("converts Tez transfer to Operation", () => {
    expect(fixture([mockImplicitAddress(1).pkh, "1"])).toEqual({
      type: "tez",
      amount: "1000000",
      recipient: mockImplicitAddress(1),
    });
  });

  it("converts FA1.2 transfer to Operation", () => {
    const mockCSVFA12TransferRow = [mockImplicitAddress(1).pkh, "10000", ghostFA12.contract];
    expect(fixture(mockCSVFA12TransferRow, (_contract, _tokenId) => ghostFA12)).toEqual({
      type: "fa1.2",
      amount: "10000",
      recipient: mockImplicitAddress(1),
      sender,
      contract: parseContractPkh(ghostFA12.contract),
      tokenId: "0",
    });
  });

  it("converts FA2 transfer to Operation", () => {
    const mockCSVFA2TransferRow = [
      mockImplicitAddress(1).pkh,
      "1",
      ghostTezzard.contract,
      ghostTezzard.tokenId,
    ];
    const res = parseOperation(
      sender,
      mockCSVFA2TransferRow,
      (_contract, _tokenId) => ghostTezzard
    );
    expect(res).toEqual({
      type: "fa2",
      amount: "1",
      recipient: mockImplicitAddress(1),
      sender,
      contract: parseContractPkh(ghostTezzard.contract),
      tokenId: ghostTezzard.tokenId,
    });
  });
});
