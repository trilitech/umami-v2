import {
  isAddressValid,
  isValidContractPkh,
  isValidImplicitPkh,
  isValidSmartRollupPkh,
  parseContractPkh,
  parseImplicitPkh,
  parsePkh,
  parseSmartRollupPkh,
} from "./Address";
import { mockContractAddress, mockImplicitAddress, mockSmartRollupAddress } from "./testUtils";

describe("Address", () => {
  const addresses = {
    contract: mockContractAddress(0),
    implicit: mockImplicitAddress(0),
    smart_rollup: mockSmartRollupAddress(0),
  };

  describe("parsePkh", () => {
    it.each(Object.entries(addresses))("parses %s address", (_, address) => {
      expect(parsePkh(address.pkh)).toEqual(address);
    });

    it("throws error for invalid address", () => {
      expect(() => parsePkh("invalid")).toThrow("Cannot parse address type: invalid");
    });
  });

  describe("isAddressValid", () => {
    it.each(Object.entries(addresses))("returns true for valid %s address", (_, address) => {
      expect(isAddressValid(address.pkh)).toBe(true);
    });

    it("returns false for invalid address", () => {
      expect(isAddressValid("invalid")).toBe(false);
    });
  });

  describe("isValidContractPkh", () => {
    it.each([
      [true, addresses.contract.pkh],
      [false, addresses.implicit.pkh],
      [false, addresses.smart_rollup.pkh],
      [false, "invalid"],
    ])("returns %s for %s address", (expected, pkh) => {
      expect(isValidContractPkh(pkh)).toBe(expected);
    });
  });

  describe("isValidImplicitPkh", () => {
    it.each([
      [false, addresses.contract.pkh],
      [true, addresses.implicit.pkh],
      [false, addresses.smart_rollup.pkh],
      [false, "invalid"],
    ])("returns %s for %s address", (expected, pkh) => {
      expect(isValidImplicitPkh(pkh)).toBe(expected);
    });
  });

  describe("isValidSmartRollupPkh", () => {
    it.each([
      [false, addresses.contract.pkh],
      [false, addresses.implicit.pkh],
      [true, addresses.smart_rollup.pkh],
      [false, "invalid"],
    ])("returns %s for %s address", (expected, pkh) => {
      expect(isValidSmartRollupPkh(pkh)).toBe(expected);
    });
  });

  describe("parse functions", () => {
    const parseFunctions = {
      parseContractPkh: {
        fn: parseContractPkh,
        validAddress: addresses.contract,
        errorMessage: "Invalid contract address",
      },
      parseImplicitPkh: {
        fn: parseImplicitPkh,
        validAddress: addresses.implicit,
        errorMessage: "Invalid implicit address",
      },
      parseSmartRollupPkh: {
        fn: parseSmartRollupPkh,
        validAddress: addresses.smart_rollup,
        errorMessage: "Invalid smart rollup address",
      },
    };

    it.each(Object.entries(parseFunctions))(
      "%s parses valid address",
      (_, { fn, validAddress }) => {
        expect(fn(validAddress.pkh)).toEqual(validAddress);
      }
    );

    it.each(Object.entries(parseFunctions))(
      "%s throws error for invalid address",
      (_, { fn, errorMessage }) => {
        expect(() => fn("invalid")).toThrow(`${errorMessage}: invalid`);
      }
    );
  });
});
