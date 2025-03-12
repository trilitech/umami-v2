import {
  defaultDerivationPathTemplate,
  getDefaultDerivationPath,
  getDerivationPathNextIndex,
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
  {
    template: defaultDerivationPathTemplate,
    currentPath: "44'/1729'/2'/0'",
    index: 5,
    result: "44'/1729'/2'/0'",
  },
  {
    template: "44'/1729'/0'/?'",
    currentPath: "44'/1729'/0'/1'",
    index: 7,
    result: "44'/1729'/0'/1'",
  },
  {
    template: "44'/1729'/?'/0'/0'",
    currentPath: "44'/1729'/4'/0'/0'",
    index: 9,
    result: "44'/1729'/4'/0'/0'",
  },
])(
  "makeDerivationPath with currentPath for $template",
  ({ template, currentPath, index, result }) => {
    expect(makeDerivationPath(template, index, currentPath)).toEqual(result);
  }
);

test.each([
  { index: 0, result: "44'/1729'/0'/0'" },
  { index: 1, result: "44'/1729'/1'/0'" },
  { index: 199, result: "44'/1729'/199'/0'" },
])("getDefaultDerivationPath for $index", ({ index, result }) => {
  expect(getDefaultDerivationPath(index)).toEqual(result);
});

test.each([
  {
    path: "44'/1729'/5'/0'",
    template: defaultDerivationPathTemplate,
    expectedIndex: 6,
  },
  {
    path: "44'/1729'/0'/8'",
    template: "44'/1729'/0'/?'",
    expectedIndex: 9,
  },
  {
    path: "44'/1729'/3'/0'/12'",
    template: "44'/1729'/?'/0'/0'",
    expectedIndex: 4,
  },
  {
    path: "44'/1729'/0'/0'/7'",
    template: "44'/1729'/0'/0'/?'",
    expectedIndex: 8,
  },
])(
  "getDerivationPathNextIndex for $path with template $template",
  ({ path, template, expectedIndex }) => {
    expect(getDerivationPathNextIndex(path, template)).toEqual(expectedIndex);
  }
);
