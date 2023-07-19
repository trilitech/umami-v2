// This is the derivation path pattern used by ledger
// Umami V1 adds a prefix as follows: "m/44'/1729'/?'/0'" which has no effect.
// Therefore we use the ledger derivation path withouth prefix everywhere.
export const defaultV1Pattern = "44'/1729'/?'/0'";

// derivation path pattern sanity check regex
const patternRegex = /^44'\/1729'\/\?'\/\d+'$/;

export const makeDerivationPath = (pattern: string, index: number) => {
  if (!patternRegex.test(pattern)) {
    throw new Error(`Invalid derivation pattern: ${pattern}`);
  }

  return pattern.replace("?", index.toString());
};
