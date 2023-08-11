import { AES_MODE } from "./AES";

const BYTE_TO_BIT = 8;
// Use the full output of the hash to maximize the derived key's strength (sha256)
const KEY_SIZE = 32;

const NUM_ITERATIONS_V2 = 600000; // https://en.wikipedia.org/wiki/PBKDF2
const NUM_ITERATIONS_V1 = 10000; // https://github.com/trilitech/umami-v1/blob/main/src/utils/SecureStorage.res#L168

export const derivePasswordBasedKeyV1 = async (
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> =>
  derivePasswordBasedKey(Buffer.alloc(32, password, "utf-8"), salt, NUM_ITERATIONS_V1);

export const derivePasswordBasedKeyV2 = async (
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> =>
  derivePasswordBasedKey(Buffer.from(password, "utf-8"), salt, NUM_ITERATIONS_V2);

const derivePasswordBasedKey = async (
  password: Buffer,
  salt: Uint8Array,
  iterations: number
): Promise<CryptoKey> => {
  // PBKDF2 (Password Based Key Derivation Function 2) is typically used for deriving a cryptographic key from a password
  const algorithm = {
    name: "PBKDF2",
    salt,
    iterations,
    hash: "SHA-256",
  };

  // brings raw password into the Web Cryptography API environment.
  const baseKey = await crypto.subtle.importKey("raw", password, algorithm.name, false, [
    "deriveKey",
  ]);

  return await crypto.subtle.deriveKey(
    algorithm,
    baseKey,
    { name: AES_MODE, length: KEY_SIZE * BYTE_TO_BIT },
    false,
    ["encrypt", "decrypt"]
  );
};
