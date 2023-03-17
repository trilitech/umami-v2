import { TextDecoder, TextEncoder } from "util";
import {
  decryptWithPassword,
  descryptSaltedSecret,
  encryptWithPassword,
  makeSaltedSecret,
} from "./aes";

import { umamiBackup } from "../mocks/umamiV1BackupFile";

beforeAll(() => {
  const crypto = require("crypto");
  window.TextEncoder = TextEncoder;
  (window as any).TextDecoder = TextDecoder;
  window.crypto = crypto.webcrypto;
});

afterAll(() => {
  delete (window as any)["crypto"];
  delete (window as any)["TextEncoder"];
  delete (window as any)["TextDecoder"];
});

describe("AES", () => {
  test("aes with password", async () => {
    const message = "my super seed phrase";
    const password = "foobar";

    const encryptedMessage = await encryptWithPassword(password, message);
    const decryptedMessage = await decryptWithPassword(
      password,
      encryptedMessage
    );

    expect(decryptedMessage).toEqual(message);
  });

  test("Umami v1 format can be restored", async () => {
    const secret = umamiBackup.recoveryPhrases[0];
    const result = await descryptSaltedSecret(secret, "password");
    const expected =
      "tone ahead staff legend common seek dove struggle ancient praise person injury poverty space enrich trick option defense ripple approve garlic favorite omit dose";

    expect(result).toEqual(expected);
  });
});

test("full use case", async () => {
  const payload = "my seed phrase";
  const password = "password";

  const secret = await makeSaltedSecret(payload, password);
  const result = await descryptSaltedSecret(secret, password);

  expect(result).toEqual(payload);
});
