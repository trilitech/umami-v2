import { defaultV1Pattern, makeDerivationPath } from "./derivationPathUtils";

describe("makeDerivationPath", () => {
  test("generates derivation path against a valid patterns", () => {
    {
      const result = makeDerivationPath(defaultV1Pattern, 3);
      expect(result).toEqual("44'/1729'/3'/0'");
    }

    {
      const result = makeDerivationPath("44'/1729'/?'/9'", 18);
      expect(result).toEqual("44'/1729'/18'/9'");
    }
  });

  test("throws an error if provided derivation pattern is not valid", () => {
    expect(() => makeDerivationPath("bar/3'/4'/?'/9'", 18)).toThrowError(
      "Invalid derivation pattern: bar/3'/4'/?'/9'"
    );
  });
});

// describe("deductDerivationPattern", () => {
//   test("it generates derivation patern against valid derivation path", () => {
//     {
//       const result = deductDerivationPattern("44'/1729'/3'/0'");
//       expect(result).toEqual("44'/1729'/?'/0'");
//     }

//     {
//       const result = deductDerivationPattern("44'/1729'/773'/0'");
//       expect(result).toEqual("44'/1729'/?'/0'");
//     }

//     {
//       const result = deductDerivationPattern("44'/1729'/0'/88'");
//       expect(result).toEqual("44'/1729'/?'/88'");
//     }
//   });

//   test("throws an error if provided derivation path is not valid", () => {
//     expect(() => deductDerivationPattern("44'/1729'/3'/0/3'")).toThrowError(
//       "Invalid derivation path: 44'/1729'/3'/0/3'"
//     );
//   });
// });
