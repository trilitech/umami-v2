import { decrypt, encrypt } from "./aes";

import { umamiBackup } from "../mocks/umamiV1BackupFile";

// This is an integration test since aes call crypto.getRandomValues which is impure

describe("AES", () => {
  test("Umami v1 format can be restored", async () => {
    const secret = umamiBackup.recoveryPhrases[0];
    const result = await decrypt(secret, "password");
    const expected =
      "tone ahead staff legend common seek dove struggle ancient praise person injury poverty space enrich trick option defense ripple approve garlic favorite omit dose";

    expect(result).toEqual(expected);
  });
});

test("full use case", async () => {
  const payload = "my seed phrase";
  const password = "password";

  const secret = await encrypt(payload, password);
  const result = await decrypt(secret, password);

  expect(result).toEqual(payload);
});
