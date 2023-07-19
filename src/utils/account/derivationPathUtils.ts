export const defaultDerivationPathPattern = "44'/1729'/?'/0'";

// Regex that enforces the standard used by Umami v1, Tezbox, Ledger, and Galleon
// https://tezostaquito.io/docs/ledger_signer/
export const validDerivationPathRegex = /^44'\/1729'\/((\?'(\/0')?\/0')|(0'(\/0')?\/\?'))$/;

export const getDefaultDerivationPath = (index: number) =>
  defaultDerivationPathPattern.replace("?", index.toString());

export const makeDerivationPath = (pattern: string, index: number) => {
  if (!validDerivationPathRegex.test(pattern)) {
    throw new Error(`Invalid derivation pattern: ${pattern}`);
  }

  return pattern.replace("?", index.toString());
};
