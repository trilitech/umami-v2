import { Operation, TezosToolkit } from "@taquito/taquito";

export const addressExists = async (pkh: string, network = "mainnet") => {
  const Tezos = new TezosToolkit("https://ghostnet.ecadinfra.com");
  // Temp solution not to have to set up proxy
  const balance = await Tezos.tz.getBalance(pkh);
  return !balance.isZero();
};

export const getOperations = (): Promise<Operation[]> => {
  return Promise.resolve([]);
};

// Temporary solution for generating fingerprint for seedphrase
// https://remarkablemark.medium.com/how-to-generate-a-sha-256-hash-with-javascript-d3b2696382fd
export async function getFingerPrint(seedPhrase: string) {
  const utf8 = new TextEncoder().encode(seedPhrase);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
