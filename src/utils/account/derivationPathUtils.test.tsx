import { defaultDerivationPathPattern, makeDerivationPath } from "./derivationPathUtils";

describe("makeDerivationPath", () => {
  test("generates derivation path against a valid patterns", () => {
    {
      const result = makeDerivationPath(defaultDerivationPathPattern, 3);
      expect(result).toEqual("44'/1729'/3'/0'");
    }
    {
      const result = makeDerivationPath("44'/1729'/0'/?'", 3);
      expect(result).toEqual("44'/1729'/0'/3'");
    }

    {
      const result = makeDerivationPath("44'/1729'/0'/0'/?'", 3);
      expect(result).toEqual("44'/1729'/0'/0'/3'");
    }

    {
      const result = makeDerivationPath("44'/1729'/?'/0'/0'", 3);
      expect(result).toEqual("44'/1729'/3'/0'/0'");
    }
  });

  test("throws an error if provided derivation pattern is not valid", () => {
    expect(() => makeDerivationPath("bar/3'/4'/?'/9'", 18)).toThrowError(
      "Invalid derivation pattern: bar/3'/4'/?'/9'"
    );
  });
});
