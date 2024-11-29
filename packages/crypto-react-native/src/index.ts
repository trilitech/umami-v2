import { buf2hex } from "@taquito/utils";
import { type EncryptedData, IV_SIZE, NUM_ITERATIONS_V2, SALT_SIZE } from "@umami/crypto";
import Aes from "react-native-aes-crypto";

export const deriveKey = async (
  password: string,
  salt: string,
  iterations: number,
  length: number
) => Aes.pbkdf2(password, salt, iterations, length, "sha512");

export const encrypt = async (data: string, password: string): Promise<EncryptedData> => {
  const salt = await Aes.randomKey(SALT_SIZE);
  const derivedKey = await deriveKey(password, salt, NUM_ITERATIONS_V2, 256);
  const iv = await Aes.randomKey(IV_SIZE);

  const encrypted = await Aes.encrypt(data, derivedKey, iv, "aes-256-cbc");

  return {
    iv: buf2hex(Buffer.from(iv)),
    salt: buf2hex(Buffer.from(salt)),
    data: buf2hex(Buffer.from(encrypted)),
  };
};

export const decrypt = async (
  { data, iv, salt }: EncryptedData,
  password: string
): Promise<string> => {
  const derivedKey = await deriveKey(password, salt, NUM_ITERATIONS_V2, 256);
  return Aes.decrypt(data, derivedKey, iv, "aes-256-cbc");
};

export const decryptV1 = async (
  { cipher, iv }: { cipher: string; iv: string },
  password: string
) => {
  const derivedKey = await deriveKey(password, "salt", 5000, 256);
  return Aes.decrypt(cipher, derivedKey, iv, "aes-256-cbc");
};
