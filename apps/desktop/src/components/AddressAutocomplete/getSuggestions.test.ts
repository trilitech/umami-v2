import { getSuggestions } from "./getSuggestions";
import { mockImplicitContact } from "../../mocks/factories";

describe("getSuggestions", () => {
  it("returns all contacts if input is empty", () => {
    expect(getSuggestions("", [mockImplicitContact(0), mockImplicitContact(1)])).toEqual([
      mockImplicitContact(0),
      mockImplicitContact(1),
    ]);
  });

  it("returns all contacts if input is a substring of a contact's name", () => {
    expect(
      getSuggestions("cd", [
        { ...mockImplicitContact(0), name: "abcd" },
        { ...mockImplicitContact(1), name: "efgh" },
      ])
    ).toEqual([{ ...mockImplicitContact(0), name: "abcd" }]);
  });

  it("returns an empty result if nothing matches the input", () => {
    expect(
      getSuggestions("de", [
        { ...mockImplicitContact(0), name: "abcd" },
        { ...mockImplicitContact(1), name: "efgh" },
      ])
    ).toEqual([]);
  });
});
