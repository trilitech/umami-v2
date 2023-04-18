import { generateMnemonic } from "bip39";

// This is put in a separate file for mocking purposes in tests
export const generate24WordMnemonic = () => {
  return generateMnemonic(256);
};
