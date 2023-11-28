export const defaultDerivationPathPattern = "44'/1729'/?'/0'";

export const DEFAULT_DERIVATION_PATH = {
  label: "Default - m/44'/1729'/?'/0'",
  value: defaultDerivationPathPattern,
};
// Taken from https://github.com/LedgerHQ/ledger-live-common/blob/60b8e77b44107b98f50758b80a01ebb850ab4e26/src/derivation.ts#L89C1-L104
export const AVAILABLE_DERIVATION_PATHS = [
  DEFAULT_DERIVATION_PATH,
  { label: "m/44'/1729'/0'/?'", value: "44'/1729'/0'/?'" },
  { label: "m/44'/1729'/?'/0'/0'", value: "44'/1729'/?'/0'/0'" },
  { label: "m/44'/1729'/0'/0'/?'", value: "44'/1729'/0'/0'/?'" },
];

export const getDefaultDerivationPath = (index: number) =>
  defaultDerivationPathPattern.replace("?", index.toString());

export const makeDerivationPath = (pattern: string, index: number) =>
  pattern.replace("?", index.toString());
