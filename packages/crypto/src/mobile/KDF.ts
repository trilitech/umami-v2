import { CryptoKey } from "react-native-quick-crypto/lib/typescript/src/keys";
import { AES_MODE } from "../AES_MODE";
import { RandomTypedArrays } from "react-native-quick-crypto/lib/typescript/src/random";

// for mobile we should use react-native-quick-crypto polifil over native crypto api
import crypto from "react-native-quick-crypto";

// Use the full output of the hash to maximize the derived key's strength (sha256)
const KEY_SIZE = 32;

const NUM_ITERATIONS_V2 = 600000; // https://en.wikipedia.org/wiki/PBKDF2
const NUM_ITERATIONS_V1 = 10000; // https://github.com/trilitech/umami-v1/blob/main/src/utils/SecureStorage.res#L168

export const derivePasswordBasedKeyV1 = async (
  password: string,
  salt: RandomTypedArrays
): Promise<CryptoKey> =>
  derivePasswordBasedKey(Buffer.alloc(32, password, "utf-8"), salt, NUM_ITERATIONS_V1);

export const derivePasswordBasedKeyV2 = async (
  password: string,
  salt: RandomTypedArrays
): Promise<CryptoKey> =>
  derivePasswordBasedKey(Buffer.from(password, "utf-8"), salt, NUM_ITERATIONS_V2);

const derivePasswordBasedKey = async (
  password: Buffer,
  salt: RandomTypedArrays,
  iterations: number
): Promise<CryptoKey> => {
  // PBKDF2 (Password Based Key Derivation Function 2) is typically used for deriving a cryptographic key from a password
  const derivedKey = crypto.pbkdf2Sync(
    password,
    Buffer.from(salt as Uint8Array),
    iterations,
    KEY_SIZE,
    "sha256"
  );

  return await crypto.subtle.importKey("raw", derivedKey, AES_MODE, false, ["encrypt", "decrypt"]);
};
