import { buf2hex, hex2Bytes } from "@taquito/utils";
import { derivePasswordBasedKeyV1, derivePasswordBasedKeyV2 } from "./KDF";
import { EncryptedData } from "./types";

// NIST recommends a salt size of at least 128 bits (16 bytes)
// https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf
const SALT_SIZE = 32;

// 12 bytes recommended for iv https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
// IV should never be reused with the same key
const IV_SIZE = 12;
export const AES_MODE = "AES-GCM";

export const encrypt = async (data: string, password: string): Promise<EncryptedData> => {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE));
  const derivedKey = await derivePasswordBasedKeyV2(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: AES_MODE,
      iv: iv,
    },
    derivedKey,
    Buffer.from(data, "utf-8")
  );

  return {
    iv: buf2hex(Buffer.from(iv)),
    salt: buf2hex(Buffer.from(salt)),
    data: buf2hex(Buffer.from(encrypted)),
  };
};

type DecryptMode = "V1" | "V2";

export const decrypt = async (
  data: EncryptedData,
  password: string,
  mode: DecryptMode = "V2"
): Promise<string> => {
  const { iv, salt, data: encrypted } = data;
  try {
    const derivedKey =
      mode === "V2"
        ? await derivePasswordBasedKeyV2(password, hex2Bytes(salt))
        : await derivePasswordBasedKeyV1(password, hex2Bytes(salt));
    const decrypted = await crypto.subtle.decrypt(
      {
        name: AES_MODE,
        iv: hex2Bytes(iv),
      },
      derivedKey,
      hex2Bytes(encrypted)
    );
    return Buffer.from(decrypted).toString("utf-8");
  } catch (error: any) {
    throw new Error(`Error decrypting data: ${error.message || error}`);
  }
};
