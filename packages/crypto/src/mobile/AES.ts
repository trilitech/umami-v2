import { buf2hex, hex2Bytes } from "@taquito/utils";
import { CustomError } from "@umami/utils";
import { differenceInMinutes } from "date-fns";

import { AES_MODE } from "../AES_MODE";
import { derivePasswordBasedKeyV1, derivePasswordBasedKeyV2 } from "./KDF";
import { type EncryptedData } from "../types";

// for mobile we should use react-native-quick-crypto polifil over native crypto api
import crypto from "react-native-quick-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";

// NIST recommends a salt size of at least 128 bits (16 bytes)
// https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf
const SALT_SIZE = 32;

// 12 bytes recommended for iv https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
// IV should never be reused with the same key
const IV_SIZE = 12;
export const encrypt = async (data: string, password: string): Promise<EncryptedData> => {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE));
  const derivedKey = await derivePasswordBasedKeyV2(password, salt);
  const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: AES_MODE,
      iv,
    },
    derivedKey,
    Buffer.from(data, "utf-8")
  );

  return {
    iv: buf2hex(Buffer.from(iv as Uint8Array)),
    salt: buf2hex(Buffer.from(salt as Uint8Array)),
    data: buf2hex(Buffer.from(encrypted)),
  };
};

type DecryptMode = "V1" | "V2";

export const TOO_MANY_ATTEMPTS_ERROR =
  "Too many unsuccessful attempts. Please wait a few minutes before trying again.";

export const decrypt = async (
  data: EncryptedData,
  password: string,
  mode: DecryptMode = "V2"
): Promise<string> => {
  const { iv, salt, data: encrypted } = data;
  try {
    if ((await getAttemptsCount()) >= 3) {
      const minutesSinceLastAttempt = differenceInMinutes(
        new Date(),
        new Date((await AsyncStorage.getItem("failedDecryptTime"))!)
      );
      if (minutesSinceLastAttempt < 5) {
        throw new CustomError(TOO_MANY_ATTEMPTS_ERROR);
      }
    }
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
    setAttemptsCount(0);
    await AsyncStorage.removeItem("failedDecryptTime");
    return Buffer.from(decrypted).toString("utf-8");
  } catch (err: any) {
    if (err?.message === TOO_MANY_ATTEMPTS_ERROR) {
      throw err;
    }
    setAttemptsCount((await getAttemptsCount()) + 1);
    await AsyncStorage.setItem("failedDecryptTime", new Date().toISOString());
    throw new CustomError("Error decrypting data: Invalid password");
  }
};

const getAttemptsCount = async () => Number((await AsyncStorage.getItem("passwordAttempts")) || 0);
const setAttemptsCount = async (count: number) =>
  await AsyncStorage.setItem("passwordAttempts", String(count));
