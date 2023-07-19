export const defaultDerivationPathPattern = "44'/1729'/?'/0'";

// Regex that enforces the standars used by Tezbox Ledger, and Galleon
// https://tezostaquito.io/docs/ledger_signer/
export const validDerivationPathRegex = /^44'\/1729'\/((\?'(\/0')?\/0')|(0'(\/0')?\/\?'))$/;

export const makeDerivationPath = (pattern: string, index: number) => {
  if (!validDerivationPathRegex.test(pattern)) {
    throw new Error(`Invalid derivation pattern: ${pattern}`);
  }

  return pattern.replace("?", index.toString());
};
