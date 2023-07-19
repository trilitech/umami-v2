// This is the derivation path pattern used by ledger
// Umami V1 adds a prefix as follows: "m/44'/1729'/?'/0'" which has no effect.
// Therefore we use the ledger derivation path withouth prefix everywhere.
export const defaultV1Pattern = "44'/1729'/?'/0'";

// derivation path pattern sanity check regex
const patternRegex = /^44'\/1729'\/\?'\/\d+'$/;

// derivation path sanity check regex
const pathRegex = /^44'\/1729'\/\d+'\/\d+'$/;

/**
 *  Returns the pattern of a given derivation path.
 *
 *  The patteren is needed to generate new derivation paths in the same format as the one provided.
 */
export const deductDerivationPattern = (derivationPath: string) => {
  const elements = derivationPath.split("/");

  if (!pathRegex.test(derivationPath)) {
    throw new Error(`Invalid derivation path: ${derivationPath}`);
  }

  const index = elements.length - 2;

  elements[index] = "?'";

  return elements.join("/");
};

export const makeDerivationPath = (pattern: string, index: number) => {
  if (!patternRegex.test(pattern)) {
    throw new Error(`Invalid derivation pattern: ${pattern}`);
  }

  return pattern.replace("?", index.toString());
};

export const getDefaultMnemonicDerivationPath = (index: number) =>
  defaultV1Pattern.replace("?", index.toString());
