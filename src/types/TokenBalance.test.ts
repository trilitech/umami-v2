import { fromRaw } from "./TokenBalance";
import { fa1Token } from "../mocks/tzktResponse";

beforeEach(() => {
  jest.spyOn(console, "warn").mockImplementation();
});

describe("TokenBalance", () => {
  it("parses token & its balance", () => {
    expect(fromRaw(fa1Token)).toEqual({
      type: "fa1.2",
      contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
      tokenId: "0",
      balance: "443870",
    });
  });

  it("returns null if balance is absent", () => {
    expect(fromRaw({ ...fa1Token, balance: null })).toEqual(null);
  });

  it("returns null if token is invalid", () => {
    expect(fromRaw({ token: {}, balance: "1" } as any)).toEqual(null);
  });
});
