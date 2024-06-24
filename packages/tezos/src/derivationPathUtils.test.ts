import {
  defaultDerivationPathTemplate,
  getDefaultDerivationPath,
  makeDerivationPath,
} from "./derivationPathUtils";

test.each([
  {
    pattern: defaultDerivationPathTemplate,
    result: "44'/1729'/3'/0'",
  },
  {
    pattern: "44'/1729'/0'/?'",
    result: "44'/1729'/0'/3'",
  },
  {
    pattern: "44'/1729'/0'/0'/?'",
    result: "44'/1729'/0'/0'/3'",
  },
  {
    pattern: "44'/1729'/?'/0'/0'",
    result: "44'/1729'/3'/0'/0'",
  },
])("makeDerivationPath for $pattern", ({ pattern, result }) => {
  expect(makeDerivationPath(pattern, 3)).toEqual(result);
});

test.each([
  { index: 0, result: "44'/1729'/0'/0'" },
  { index: 1, result: "44'/1729'/1'/0'" },
  { index: 199, result: "44'/1729'/199'/0'" },
])("getDefaultDerivationPath for $index", ({ index, result }) => {
  expect(getDefaultDerivationPath(index)).toEqual(result);
});
