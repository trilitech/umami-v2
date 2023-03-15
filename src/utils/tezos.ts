import { Operation } from "@taquito/taquito";
import axios from "axios";

export const addressExists = (pkh: string, network = "mainnet") => {
  // TODO replace this method of checking
  const url = `https://${network}.umamiwallet.com/accounts/${pkh}/exists`;
  return axios.get(url);
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
